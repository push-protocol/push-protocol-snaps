import { ethers } from "ethers";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { AddAddressRequestParams, ApiParams } from "../../types";
import {
  isAddressEnabled,
  handleAddAddress,
  handleConfirmAddress,
} from "../../utils";

/**
 * Adds an address to the Snap.
 * @param params The parameters for adding an address.
 */
export const addAddress = async (params: ApiParams): Promise<void> => {
  try {
    const { state, requestParams } = params;
    const requestParamsObj = requestParams as AddAddressRequestParams;

    // Check if requestParamsObj is valid and contains an address
    if (requestParamsObj != null && requestParamsObj.address != null) {
      // Check if the address is not already added and is a valid Ethereum address
      const addresscheck = isAddressEnabled(state, requestParamsObj.address);
      const isValidAddress = ethers.utils.isAddress(requestParamsObj.address);

      if (addresscheck == false && isValidAddress == true) {
        // Prompt the user for confirmation to add the address
        const res = await snap.request({
          method: "snap_dialog",
          params: {
            type: "confirmation",
            content: panel([
              heading("Address Addition"),
              divider(),
              text("Do you want to add this address to the snap ?"),
              text(`${requestParamsObj.address}`),
            ]),
          },
        });

        if (res) {
          // Add the address to the Snap and confirm the addition
          await handleAddAddress(requestParamsObj.address);
          await handleConfirmAddress();
        } else {
          // Handle cancellation of address addition
          await snap.request({
            method: "snap_dialog",
            params: {
              type: "confirmation",
              content: panel([
                heading("Error"),
                divider(),
                text(`${requestParamsObj.address}`),
                text("Address not added to the snap"),
              ]),
            },
          });
        }
      } else {
        // Handle case where address is already added to the Snap
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
    console.error("Error in addAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
