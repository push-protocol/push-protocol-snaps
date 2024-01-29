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

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  if (allowedSnapOrigins.includes(origin)) {
    const requestParams = request?.params as unknown as ApiRequestParams;

    // For non-encrypted state
    // ToDo: For encrypted state, when it's usecase comes
    let state = await getSnapState({ encrypted: false });
    if (!state) {
      state = {}; // ToDo: Use default snap state here from config
      // initialize state if empty and set default data
      await updateSnapState({
        newState: state,
        encrypted: false,
      });
    } else {
      // ToDo: update the snap state to latest version and modify it - to use getModifiedSnapState
      // await updateSnapState(state);
    }

    const apiParams: ApiParams = {
      state,
      requestParams,
    };

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
