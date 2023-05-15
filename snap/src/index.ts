import { OnRpcRequestHandler, OnCronjobHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { filterNotifications } from "./utils/fetchnotifs";
import { getNotifications } from "./utils/fetchnotifs";
import { ethers } from "ethers";
import { fetchAllAddrNotifs } from "./utils/fetchnotifs";
import { addAddress } from "./utils/fetchAddress";
import { confirmAddress } from "./utils/fetchAddress";
import { clearAddress } from "./utils/fetchAddress";
import { removeAddress } from "./utils/fetchAddress";
import { popupHelper } from "./utils/popupHelper";
import { randomBytes } from "ethers/lib/utils";

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
            text('🔔 Start getting notifications by opting into channels'),
            text('🔔 Get live wallet Activities on ETH,POLYGON,BNB,OP,ARB Chains')
          ]),
        },
      });
      return true;
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
      if (msgs) {
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
    }
    default:
      throw new Error("Method not found.");
  }
};
