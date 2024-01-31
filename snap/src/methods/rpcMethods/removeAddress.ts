import { ethers } from "ethers";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, RemoveAddressRequestParams } from "../../types";
import {
  isAddressEnabled,
  handleConfirmAddress,
  handleRemoveAddress,
} from "../../utils";

/**
 * Removes an address from the Snap.
 * @param params The parameters for removing an address.
 */
export const removeAddress = async (params: ApiParams): Promise<void> => {
  try {
    const { state, requestParams } = params;
    const requestParamsObj = requestParams as RemoveAddressRequestParams;

    // Check if requestParamsObj is valid and contains an address
    if (requestParamsObj != null && requestParamsObj.address != null) {
      // Check if the address exists in Snap storage and is a valid Ethereum address
      const addresscheck = isAddressEnabled(state, requestParamsObj.address);
      const isValidAddress = ethers.utils.isAddress(requestParamsObj.address);

      if (addresscheck == true && isValidAddress == true) {
        // Prompt the user for confirmation to remove the address
        const res = await snap.request({
          method: "snap_dialog",
          params: {
            type: "confirmation",
            content: panel([
              heading("Address Removal"),
              divider(),
              text("Do you want to remove this address"),
              text(`${requestParamsObj.address}`),
            ]),
          },
        });
        if (res) {
          // Remove the address from the Snap and confirm the removal
          await handleRemoveAddress(requestParamsObj.address);
          await handleConfirmAddress();
        }
      } else {
        // Handle case where address does not exist in Snap storage
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
      // Handle error reading input
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
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in removeAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
