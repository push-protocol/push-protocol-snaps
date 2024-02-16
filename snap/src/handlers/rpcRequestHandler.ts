import { OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, ApiRequestParams, SnapRpcMethod } from "../types";
import {
  addAddress,
  channelOptin,
  disableSnoozeNotifs,
  getSnoozeInfo,
  removeAddress,
  setSnoozeEnabledDuration,
  welcomeDialog,
} from "../methods";
import { getEnabledAddresses, getModifiedSnapState } from "../utils";
import { allowedSnapOrigins } from "../config";

/**
 * Handles RPC requests from Snap-enabled dapps.
 * @param {Object} params - The parameters object containing the origin and request.
 * @param {string} params.origin - The origin of the request.
 * @param {Object} params.request - The request object containing the method and parameters.
 * @returns {Promise<any>} - The result of the RPC request.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  try {
    // Check if the origin is allowed
    if (allowedSnapOrigins.includes(origin)) {
      const requestParams = request?.params as unknown as ApiRequestParams;

      // For non-encrypted state
      // ToDo: For encrypted state, when its use case comes

      // Retrieve the current Snap state and modify it to the latest version if necessary
      const state = await getModifiedSnapState({ encrypted: false });

      const apiParams: ApiParams = {
        state,
        requestParams,
      };

      // Handles different RPC methods
      switch (request.method as SnapRpcMethod) {
        case SnapRpcMethod.AddAddress: {
          // Handles the addAddress RPC method
          return addAddress(apiParams);
        }
        case SnapRpcMethod.RemoveAddress: {
          // Handles the removeAddress RPC method
          return removeAddress(apiParams);
        }
        case SnapRpcMethod.Welcome: {
          // Handles the welcome RPC method
          return welcomeDialog();
        }
        // case SnapRpcMethod.TogglePopup: {
        //   // Handles the togglePopup RPC method
        //   return togglePopup(apiParams);
        // }
        case SnapRpcMethod.SetSnoozeDuration: {
          // Handles the set snooze duration RPC method
          await setSnoozeEnabledDuration(apiParams);
          break;
        }
        case SnapRpcMethod.GetSnoozeInfo: {
          return getSnoozeInfo(apiParams);
        }
        case SnapRpcMethod.DisableSnoozeNotifs: {
          // Handles the disable snooze duration RPC method
          await disableSnoozeNotifs(apiParams);
          break;
        }
        case SnapRpcMethod.OptIn: {
          // Handles the optIn RPC method
          return channelOptin(apiParams);
        }
        case SnapRpcMethod.OptInComplete: {
          // Displays a success message for OptInComplete RPC method
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Channel Opt-In"),
                divider(),
                text(
                  `You've successfully opted into the channel to receive notifications directly into MetaMask`
                ),
              ]),
            },
          });
          break;
        }
        case SnapRpcMethod.GetAddresses: {
          const addresses = getEnabledAddresses(state);
          return addresses;
        }
        // case SnapRpcMethod.GetToggleStatus: {
        //   // Retrieve and return the toggle status from Snap storage
        //   const persistedData = await SnapStorageCheck();
        //   const popuptoggle = persistedData.popuptoggle;
        //   return popuptoggle;
        // }
        case SnapRpcMethod.FirstChannelOptIn: {
          // Displays a congratulations message for FirstChannelOptIn RPC method
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("Congratulations!"),
                divider(),
                text(`You have successfully opted in to your first channel. \n\n
                  Now, you are all set to receive notifications directly to your MetaMask Wallet.`),
              ]),
            },
          });
          break;
        }
        default:
          // Throw an error for unsupported RPC methods
          throw new Error("Method not found.");
      }
    } else {
      // Display an error message if the dapp is not supported
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
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in onRpcRequest:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
