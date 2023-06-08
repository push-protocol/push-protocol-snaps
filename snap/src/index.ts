import { OnCronjobHandler, OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { addAddress, confirmAddress } from "./utils/fetchAddress";
import { fetchAllAddrNotifs } from "./utils/fetchnotifs";
import { popupHelper } from "./utils/popupHelper";
import { popupToggle } from "./utils/toggleHelper";

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
          ]),
        },
      });
      return true;
    }
    case "togglepopup": {

      popupToggle(0);

      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Notification Snooze Off"),
            text("You will be receiving popup notifications now"),
          ]),
        },
      });
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
      
      let persistedData = await snap.request({
        method: "snap_manageState",
        params: { operation: "get" },
      });

      let popuptoggle = Number(persistedData.popuptoggle) + msgs.length;

      const data ={
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
      }

      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
      });

      if (Number(popuptoggle) < 25) {
        if (msgs.length > 0) {
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("You have a new notifications!"),
                divider(),
                ...msgs.map((msg) => text(msg)),
              ]),
            },
          });
        }
      }else{
        await snap.request({
          method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Notification snooze"),
                divider(),
                text(`You've been receiving too many notifications. \n The pop-up notifications are now snoozed `),
                text(`You can turn them back on from the dapp`)
              ]),
            },
        });
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
