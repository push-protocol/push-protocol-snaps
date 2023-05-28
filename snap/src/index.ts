import { OnCronjobHandler, OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { addAddress, clearAddress, confirmAddress, removeAddress } from "./utils/fetchAddress";
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
    case "clear": {
      clearAddress();
      break;
    }
    case "remove": {
      removeAddress(request.params.address || "0x0");
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
      await popupToggle();

      let persistedData = await snap.request({
        method: "snap_manageState",
        params: { operation: "get" },
      });

      let popuptoggle = persistedData.popuptoggle;

      let msg = popuptoggle
        ? "🔔 Popup Notifications Enabled"
        : "🔕 Popup Notifications Disabled";

      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Popup Toggle"),
            divider(),
            text(`${msg}`),
            divider(),
            text("🔔 You can change this setting anytime from the Dapp"),
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
      const msgs = popupHelper(notifs);

      let persistedData = await snap.request({
        method: "snap_manageState",
        params: { operation: "get" },
      });

      let popuptoggle = persistedData.popuptoggle;

      if (popuptoggle) {
        if (msgs) {
          snap.request({
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
      }

      if (msgs) {
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
