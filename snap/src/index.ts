import { OnCronjobHandler, OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  addAddress,
  confirmAddress,
  removeAddress,
} from "./utils/fetchAddress";
import { fetchAllAddrNotifs } from "./utils/fetchnotifs";
import { popupHelper } from "./utils/popupHelper";
import { popupToggle } from "./utils/toggleHelper";
import { SnapStorageAddressCheck, SnapStorageCheck } from "./helper/snapstoragecheck";
import { ethers } from "ethers";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  if (
    origin === "https://app.push.org" ||
    origin === "https://staging.push.org" ||
    origin === "https://dev.push.org" ||
    origin === "http://localhost:3000"
  ) {
    switch (request.method) {
      case "pushproto_addaddress": {
        if (request.params != null && request.params.address != null) {
          let addresscheck = await SnapStorageAddressCheck(
            request.params.address
          );
          let isValidAddress = ethers.utils.isAddress(request.params.address);
          if (addresscheck == false && isValidAddress == true) {
            const res = await snap.request({
              method: "snap_dialog",
              params: {
                type: "confirmation",
                content: panel([
                  heading("Address Addition"),
                  divider(),
                  text("Do you want to add this address to the snap ?"),
                  text(`${request.params.address}`),
                ]),
              },
            });
            if (res) {
              await addAddress(request.params.address);
              await confirmAddress();
            } else {
              await snap.request({
                method: "snap_dialog",
                params: {
                  type: "confirmation",
                  content: panel([
                    heading("Error"),
                    divider(),
                    text(`${request.params.address}`),
                    text("Address not added to the snap"),
                  ]),
                },
              });
            }
          } else {
            await snap.request({
              method: "snap_dialog",
              params: {
                type: "alert",
                content: panel([
                  heading("Error"),
                  divider(),
                  text("Address already added to the snap"),
                ]),
              },
            });
          }
        } else {
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Error"),
                divider(),
                text("Error reading input, please try again"),
              ]),
            },
          });
        }
        break;
      }
      case "pushproto_removeaddress": {
        if (request.params != null && request.params.address != null) {
          let addresscheck = await SnapStorageAddressCheck(
            request.params.address
          );
          let isValidAddress = ethers.utils.isAddress(request.params.address);
          if (addresscheck == true && isValidAddress == true) {
            const res = await snap.request({
              method: "snap_dialog",
              params: {
                type: "confirmation",
                content: panel([
                  heading("Address Removal"),
                  divider(),
                  text("Do you want to remove this address"),
                  text(`${request.params.address}`),
                ]),
              },
            });
            if (res) {
              await removeAddress(request.params.address);
              await confirmAddress();
            }
          } else {
            await snap.request({
              method: "snap_dialog",
              params: {
                type: "alert",
                content: panel([
                  heading("Error"),
                  divider(),
                  text("Cannot remove address, it does not exist in the snap"),
                ]),
              },
            });
          }
        } else {
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Error"),
                divider(),
                text("Error reading input, please try again"),
              ]),
            },
          });
        }
        break;
      }
      case "pushproto_welcome": {
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
      case "pushproto_togglepopup": {
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
      case "pushproto_getaddresses": {
        let persistedData = await SnapStorageCheck();
        let addresses = persistedData.addresses;
        return addresses;
      }
      case "pushproto_gettogglestatus":{
        let persistedData = await SnapStorageCheck();
        let popuptoggle = persistedData.popuptoggle;
        return popuptoggle;
      }
      default:
        throw new Error("Method not found.");
    }
  } else {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Error"),
          text("This dapp is not supported by Push Notification Snap"),
        ]),
      },
    });
    return true;
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case "fireCronjob": {
      const notifs = await fetchAllAddrNotifs();
      let msgs = popupHelper(notifs);

      let persistedData = await SnapStorageCheck();

      let popuptoggle = msgs.length;
      if (persistedData != null) {
        popuptoggle += Number(persistedData.popuptoggle);
      }

      const data = {
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
      };

      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
      });

      if (Number(popuptoggle) < 40) {
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
      } else {

        popupToggle(0);

        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Notification snooze"),
              divider(),
              text(
                `You've been receiving too many notifications. \n The pop-up notifications are now snoozed `
              ),
              text(`You can turn them back on from the dapp`),
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
