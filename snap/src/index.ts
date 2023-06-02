import { OnCronjobHandler, OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { addAddress, confirmAddress } from "./utils/fetchAddress";
import { fetchAllAddrNotifs } from "./utils/fetchnotifs";
import { popupHelper } from "./utils/popupHelper";
import { popupToggle } from "./utils/toggleHelper";
import { fetchPushChats } from "./utils/fetchPushChats";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "hello": {
      await addAddress(request.params.address || "0x0");
      await confirmAddress();
      break;
    }
    case "init": {
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Welcome to Push Notification Snap!"),
            divider(),
            text("🔔 Start getting notifications by opting into channels"),
            text(
              "🔔 Get live wallet Activities on ETH,POLYGON,BNB,OP,ARB Chains"
            ),
          ]),
        },
      });
      return true;
    }
    case "togglepopup": {
      const time = await snap.request({
        method: "snap_dialog",
        params: {
          type: "prompt",
          content: panel([
            heading("Snooze Notifications"),
            text("Enter the time in hours to snooze pop-up notifications"),
          ]),
          placeholder: "Enter time in hours",
        },
      });

      if (time == null) {
        await popupToggle(
          String((Date.now() / 1000 + Number(0) * 3600).toFixed(0))
        );
      } else {
        await popupToggle(
          String((Date.now() / 1000 + Number(time) * 3600).toFixed(0))
        );
      }

      if (time != null) {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Notifications Snoozed"),
              divider(),
              text(
                "You will not receive pop-up notifications for the next " +
                  time +
                  " hours"
              ),
            ]),
          },
        });
      } else {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Notifications Snoozed Off"),
              divider(),
              text("Notification Snooze turned off"),
            ]),
          },
        });
      }
      break;
    }
    default:
      throw new Error("Method not found.");
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case "fireCronjob": {
      const notifs = await fetchAllAddrNotifs();
      let msgs = popupHelper(notifs);

      let chat = await fetchPushChats();

      if (chat) {
        msgs.push(chat);
      }

      let persistedData = await snap.request({
        method: "snap_manageState",
        params: { operation: "get" },
      });

      let popuptoggle = persistedData.popuptoggle;

      if (Number(String(popuptoggle)) < Date.now() / 1000) {
        if (msgs.length > 0) {
          const res = await snap.request({
            method: "snap_dialog",
            params: {
              type: "confirmation",
              content: panel([
                heading("You have a new notifications!"),
                divider(),
                ...msgs.map((msg) => text(msg)),
              ]),
            },
          });
          if (res === false) {
            const time = await snap.request({
              method: "snap_dialog",
              params: {
                type: "prompt",
                content: panel([
                  heading("Snooze Notifications"),
                  text(
                    "Enter the time in hours to snooze pop-up notifications"
                  ),
                ]),
                placeholder: "Enter time in hours",
              },
            });

            if (time == null) {
              await popupToggle(
                String((Date.now() / 1000 + Number(0) * 3600).toFixed(0))
              );
            } else {
              await popupToggle(
                String((Date.now() / 1000 + Number(time) * 3600).toFixed(0))
              );
            }

            if (time != null) {
              await snap.request({
                method: "snap_dialog",
                params: {
                  type: "alert",
                  content: panel([
                    heading("Notifications Snoozed"),
                    divider(),
                    text(
                      "You will not receive pop-up notifications for the next " +
                        time +
                        " hours"
                    ),
                  ]),
                },
              });
            } else {
              await snap.request({
                method: "snap_dialog",
                params: {
                  type: "alert",
                  content: panel([
                    heading("Notifications Snoozed Off"),
                    divider(),
                    text("Notification Snooze turned off"),
                  ]),
                },
              });
            }
          }
        }
      }

      if (msgs.length > 0) {
        let maxlength = msgs.length > 11 ? 11 : msgs.length;
        for (let i = 0; i < maxlength; i++) {
          let msg = msgs[i];
          msg = String(msg);
          msg = msg.slice(0, 47);
          await snap.request({
            method: "snap_notify",
            params: {
              type: "inApp",
              message: msg,
            },
          });
          await sleep(5000);
        }
      }
    }
    default:
      throw new Error("Method not found.");
  }
};
