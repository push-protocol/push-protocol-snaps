import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { getModifiedSnapState, updateSnapState } from "./snapStateUtils";

import { ethers } from "ethers";
import { AddressMetadata, LatestSnapState } from "../types";
import { getEnabledAddresses } from "./helperFn";
import { getCurrentTimestamp } from "./time";

/**
 * Handles the addition of an Ethereum address to the list of monitored addresses.
 * @param address The Ethereum address to be added.
 */
export const handleAddAddress = async (address: string) => {
  try {
    // Check if the provided address is valid
    const isValidAddress = ethers.utils.isAddress(address);

    if (isValidAddress) {
      const state = await getModifiedSnapState({ encrypted: false });
      // Retrieve the metadata for the specified address.
      const metadata = state.addresses[address];

      /**
       * If the metadata exists, update the 'enabled' property to true.
       * Otherwise, create a new metadata object with 'enabled' set to true.
       */
      const updatedMetadata: AddressMetadata = metadata
        ? {
            ...metadata,
            enabled: true,
            lastFeedsProcessedTimestamp: getCurrentTimestamp(),
          }
        : { enabled: true, lastFeedsProcessedTimestamp: getCurrentTimestamp() };

      // Create a new SnapStateV1 object with the updated metadata.

      const updatedState: LatestSnapState = {
        ...state,
        addresses: {
          ...state.addresses,
          [address]: updatedMetadata,
        },
      };

      // update the snap state
      await updateSnapState({
        newState: updatedState,
        encrypted: false,
      });
    } else {
      // Display an error alert for an invalid Ethereum address
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([heading("Error"), text("Invalid Ethereum Address")]),
        },
      });
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in handleAddAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};

/**
 * Handles the confirmation of added addresses, displaying a summary of active addresses.
 */
export const handleConfirmAddress = async () => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });

    if (state != null) {
      const enabledAddressesList = getEnabledAddresses(state);
      let msg = "";
      for (let i = 0; i < enabledAddressesList?.length; i++) {
        msg = msg + "🔹" + enabledAddressesList[i] + "\n\n";
      }

      if (msg.length > 0) {
        // Display a success alert with a summary of added addresses
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Address added"),
              divider(),
              text(
                `Congratulations, Your address is now all set to receive notifications. \n\n Opt-in to your favourite channels now.`
              ),
              text("Following addresses will receive notifications:"),
              divider(),
              text(`${msg}`),
            ]),
          },
        });
      } else {
        // Display an alert for no active addresses
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("No Active Addresses"),
              divider(),
              text("Start adding addresses to receive notifications"),
            ]),
          },
        });
      }
    } else {
      // Display an error alert for no addresses added
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([heading("Error"), text("No addresses added")]),
        },
      });
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in handleConfirmAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};

/**
 * Handles the removal of an Ethereum address from the list of monitored addresses.
 * @param address The Ethereum address to be removed.
 */
export const handleRemoveAddress = async (address: string) => {
  try {
    // Check if the provided address is valid
    const isValidAddress = ethers.utils.isAddress(address);

    if (isValidAddress) {
      const state = await getModifiedSnapState({ encrypted: false });
      // Retrieve the metadata for the specified address.
      const metadata = state.addresses[address];

      /**
       * If the metadata exists, update the 'enabled' property to false.
       * Otherwise, create a new metadata object with 'enabled' set to false.
       */
      const updatedMetadata: AddressMetadata = metadata
        ? { ...metadata, enabled: false, lastFeedsProcessedTimestamp: 0 }
        : { enabled: false, lastFeedsProcessedTimestamp: 0 };

      //Create a new SnapStateV1 object with the updated metadata.

      const updatedState: LatestSnapState = {
        ...state,
        addresses: {
          ...state.addresses,
          [address]: updatedMetadata,
        },
      };

      // update the snap state
      await updateSnapState({
        newState: updatedState,
        encrypted: false,
      });
    } else {
      // Display an error alert for an invalid Ethereum address
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([heading("Error"), text("Invalid Ethereum Address")]),
        },
      });
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in handleRemoveAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};

/**
 * Fetches enabled addresses from the Snap state.
 * @returns {Promise<string[]>} - Resolves with an array of enabled addresses or an empty array if an error occurs.
 */
export const fetchAddress = async (): Promise<string[]> => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });
    if (state != null) {
      const addresses = getEnabledAddresses(state);
      return addresses;
    } else {
      return [];
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in fetchAddress:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
