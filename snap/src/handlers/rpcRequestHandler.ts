import { OnRpcRequestHandler } from "@metamask/snaps-types";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, ApiRequestParams, SnapRpcMethod } from "../types";
import {
  addAddress,
  channelOptin,
  removeAddress,
  togglePopup,
  welcomeDialog,
} from "../methods";
import { getSnapState, updateSnapState, SnapStorageCheck } from "../utils";
import { allowedSnapOrigins } from "../config";

/**
 * Handles RPC requests from Snap-enabled dapps.
 * @param {Object} params - The parameters object containing the origin and request.
 * @param {string} params.origin - The origin of the request.
 * @param {Object} params.request - The request object containing the method and parameters.
 * @returns {Promise<any>} - The result of the RPC request.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  // Check if the origin is allowed
  if (allowedSnapOrigins.includes(origin)) {
    const requestParams = request?.params as unknown as ApiRequestParams;
     // For non-encrypted state
    // ToDo: For encrypted state, when it's usecase comes

    // Retrieve the current Snap state
    let state = await getSnapState({ encrypted: false });

    // Initialize the state if empty
    if (!state) {
      state = {}; // ToDo: Use default snap state here from config
      // Initialize state if empty and set default data
      await updateSnapState({
        newState: state,
        encrypted: false,
      });
    } else {
      // ToDo: Update the snap state to the latest version and modify it - to use getModifiedSnapState
      // await updateSnapState(state);
    }

    const apiParams: ApiParams = {
      state,
      requestParams,
    };

    // Handle different RPC methods
    switch (request.method as SnapRpcMethod) {
      case SnapRpcMethod.AddAddress: {
        return addAddress(apiParams);
      }
      case SnapRpcMethod.RemoveAddress: {
        return removeAddress(apiParams);
      }
      case SnapRpcMethod.Welcome: {
        return welcomeDialog();
      }
      case SnapRpcMethod.TogglePopup: {
        return togglePopup(apiParams);
      }
         // case SnapRpcMethod.SnoozeDuration: {
      //   await snoozeDuration();
      //   break;
      // }
      case SnapRpcMethod.OptIn: {
        return channelOptin(apiParams);
      }
      case SnapRpcMethod.OptInComplete: {
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
        let persistedData = await SnapStorageCheck();
        let addresses = persistedData.addresses;
        return addresses;
      }
      case SnapRpcMethod.GetToggleStatus: {
        let persistedData = await SnapStorageCheck();
        let popuptoggle = persistedData.popuptoggle;
        return popuptoggle;
      }
      case SnapRpcMethod.FirstChannelOptIn: {
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
};
