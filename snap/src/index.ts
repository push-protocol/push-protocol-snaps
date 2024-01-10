import { OnCronjobHandler, OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  addAddress,
  confirmAddress,
  removeAddress,
  snoozeNotifs,
} from "./utils/fetchAddress";
import { fetchChannels } from "./utils/fetchChannels";
import { fetchChats } from "./utils/fetchChat";
import { fetchAllAddrNotifs } from "./utils/fetchnotifs";

import { popupHelper } from "./utils/popupHelper";
import { popupToggle, setSnoozeDuration } from "./utils/toggleHelper";
import {
  SnapStorageAddressCheck,
  SnapStorageCheck,
  SnapStorageChatCheck,
} from "./helper/snapstoragecheck";
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
       
      case "pushproto_chats": {
       const persistedData = await SnapStorageCheck();
        let key: any = persistedData.key;

        const decryptedPGPKey = {
          key: persistedData.key,
        };

        console.log(key, "decrypted key from LS dapp");

        await snap.request({
          method: "snap_manageState",
          params: { operation: "update", newState: decryptedPGPKey },
        });

        const data = await fetchChats(decryptedPGPKey);

        console.log(data, "decrypted key")

       

        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Chats:"),
              divider(),
              text(`here are the chats ${data}`),
            ]),
          },
        });
      }


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
        let persistedData = await SnapStorageCheck();
        let popuptoggle = persistedData.popuptoggle;

        if (Number(popuptoggle) <= 25) {
          popupToggle(27);

          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Snooze Pop-ups On"),
                text("Disable Notification Pop-ups from Push Snap"),
              ]),
            },
          });
        } else {
          popupToggle(0);

          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Snooze Pop-ups Off"),
                text("Enable Notification Pop-ups from Push Snap"),
              ]),
            },
          });
        }

        break;
      }

      case "pushproto_snoozeduration": {
        await SnapStorageCheck();

        const result = await snap.request({
          method: "snap_dialog",
          params: {
            type: "confirmation",
            content: panel([
              heading("Snooze Notifications"),
              divider(),
              text(
                "You are receiving a lot of notifications, do you want to turn snooze on?"
              ),
            ]),
          },
        });

        if (result) {
          const snoozeDuration = await snoozeNotifs();
          setSnoozeDuration(Number(snoozeDuration));
        }
        break;
      }

      case "pushproto_optin": {
        const res = await fetchChannels(req.params.channeladdress);
        const channelName = res.channelName;
        const unsubscribedAccounts = res.unsubscribedAccounts;
        if (unsubscribedAccounts.length == 0) {
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Channel Opt-In"),
                divider(),
                text("You are already subscribed to this channel"),
              ]),
            },
          });
          return false;
        } else {
          const res = await snap.request({
            method: "snap_dialog",
            params: {
              type: "confirmation",
              content: panel([
                heading("Channel Opt-In"),
                divider(),
                text(`Do you want to subscribe to ${channelName} ?`),
              ]),
            },
          });
          return res;
        }
      }

      //decryptedpgp key
      //get modify store



      case "pushproto_optincomplete": {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Channel Opt-In"),
              divider(),
              text(
                `You've succesfully opted into the channel to receive notifications directly into MetaMask`
              ),
            ]),
          },
        });
      }
      case "pushproto_getaddresses": {
        let persistedData = await SnapStorageCheck();
        let addresses = persistedData.addresses;
        return addresses;
      }
      case "pushproto_gettogglestatus": {
        let persistedData = await SnapStorageCheck();
        let popuptoggle = persistedData.popuptoggle;
        return popuptoggle;
      }
      case "pushproto_firstchanneloptin": {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Congratulations !"),
              divider(),
              text(`You have successfully opted in to your first channel. \n\n
              Now, You are all set to receive notifications directly to your Metamask Wallet.`),
            ]),
          },
        });
        break;
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

      let currentTimeEpoch = new Date().getTime();

      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data, encrypted: false },
      });

      // if user is recieving more than 25 notifications, then remind them to turn on snooze
      if (
        Number(popuptoggle) <= 25 &&
        currentTimeEpoch > Number(persistedData.snoozeDuration)
      ) {
        if (msgs.length > 0) {
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("You have a new notification!"),
                divider(),
                ...msgs.map((msg) => text(msg)),
              ]),
            },
          });
        }
      } else if (
        Number(popuptoggle) == 26 &&
        currentTimeEpoch <= Number(persistedData.snoozeDuration)
      ) {
        await SnapStorageCheck();

        const result = await snap.request({
          method: "snap_dialog",
          params: {
            type: "confirmation",
            content: panel([
              heading("Snooze Notifications"),
              divider(),
              text(
                "You are receiving a lot of notifications, do you want to turn snooze on?"
              ),
            ]),
          },
        });

        if (result) {
          const snoozeDuration = await snoozeNotifs();
          setSnoozeDuration(Number(snoozeDuration));
        }
        break;
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
      break;
    }
    case "checkActivity": {
      const notifs = await fetchAllAddrNotifs();
      let persistedData = await SnapStorageCheck();
      const addresses: string[] = persistedData.addresses;
      if (notifs.length == 0 || addresses.length == 0) {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Activity Alert"),
              divider(),
              text(
                `We noticed zero activity in your snap since your last visit. \n\n
                Visit app.push.org/snap to opt-in to channels and start using snap for notifications.`
              ),
            ]),
          },
        });
      }
      break;
    }
    case "pushproto_removesnooze": {
      const persistedData = await SnapStorageCheck();
      const snoozeFlag = persistedData.popuptoggle;
      if (Number(snoozeFlag) >= 41) {
        const data = {
          addresses: persistedData.addresses,
          popuptoggle: 0,
        };

        await snap.request({
          method: "snap_manageState",
          params: { operation: "update", newState: data },
        });

        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Snooze Alert"),
              text(
                "Notification snooze has been turned off, you will start getting popup notifications from now on."
              ),
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
