import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck } from "./snapstoragecheck";
import { getSnapState, updateSnapState } from "./snapStateUtils";

const { ethers } = require("ethers");

/**
 * Handles the addition of an Ethereum address to the list of monitored addresses.
 * @param address The Ethereum address to be added.
 */
export const handleAddAddress = async (address: string) => {
  const persistedData = await getSnapState({ encrypted: false });

  // Check if the provided address is valid
  const isValidAddress = ethers.utils.isAddress(address);

  if (isValidAddress) {
    if (persistedData == null) {
      // Create new data if none exists
      const data = {
        addresses: [address],
        popuptoggle: 0,
      };
      await updateSnapState({
        newState: data,
        encrypted: false,
      });
    } else {
      // Update existing data with the new address if it doesn't already exist
      const addrlist = persistedData.addresses;
      const popuptoggle = persistedData.popuptoggle;
      if (addrlist!.includes(address)) {
        return;
      } else {
        addrlist!.push(address);
        const data = {
          addresses: addrlist,
          popuptoggle: popuptoggle,
        };
        await updateSnapState({
          newState: data,
          encrypted: false,
        });
      }
    }
  } else {
    // Display an error alert for an invalid Ethereum address
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Error"),
          text("Invalid Ethereum Address address"),
        ]),
      },
    });
  }
};

/**
 * Handles the confirmation of added addresses, displaying a summary of active addresses.
 */
export const handleConfirmAddress = async () => {
  const persistedData = await getSnapState({ encrypted: false });
  if (persistedData != null) {
    const data = persistedData.addresses;
    let msg = "";
    for (let i = 0; i < data!.length; i++) {
      msg = msg + "🔹" + data![i] + "\n\n";
    }
    if (msg.length > 0) {
      // Display a success alert with a summary of added addresses
      return snap.request({
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
    return snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([heading("Error"), text("No addresses added")]),
      },
    });
  }
};

/**
 * Handles the removal of an Ethereum address from the list of monitored addresses.
 * @param address The Ethereum address to be removed.
 */
export const handleRemoveAddress = async (address: string) => {
  const persistedData = await SnapStorageCheck();
  let addresslist = persistedData.addresses;
  let popuptoggle = persistedData.popuptoggle;
  if (addresslist.includes(address)) {
    for (var i = addresslist.length - 1; i >= 0; i--) {
      if (addresslist[i] === address) {
        addresslist.splice(i, 1);
      }
    }
  }

  const newData = {
    addresses: addresslist,
    popuptoggle: popuptoggle,
  };

  // Update the state after removing the address
  await updateSnapState({
    newState: newData,
    encrypted: false,
  });
};

/**
 * Fetches the list of monitored Ethereum addresses.
 * @returns An array of Ethereum addresses.
 */
export const fetchAddress = async () => {
  const persistedData = await getSnapState({ encrypted: false });
  if (persistedData != null) {
    const addresses = persistedData!.addresses;
    return addresses;
  } else {
    return [];
  }
};

/**
 * Sets the snooze duration for notifications.
 * @returns The snooze duration in hours.
 */
export const snoozeNotifs = async () => {
  // Prompt the user to set the snooze duration
  const snoozeDuration = await snap.request({
    method: "snap_dialog",
    params: {
      type: "prompt",
      content: panel([
        heading("Set snooze duration"),
        divider(),
        text("Customize your snooze from 1 to 24 hours and stay focused."),
      ]),
      placeholder: 'Snooze duration in Hours (e.g. 6)',
    },
  });

  if (typeof snoozeDuration === 'string') {
    let snoozeDurationNumber = parseInt(snoozeDuration, 10);
    
    // Ensure snooze duration is within valid range
    if (snoozeDurationNumber > 24) {
      snoozeDurationNumber = 24;
    } else if (snoozeDurationNumber === undefined) {
      snoozeDurationNumber = 0;
    }

    // Display an alert confirming the snooze duration
    await snap.request({
      method:"snap_dialog",
      params:{
        type:"alert",
        content:panel([
          heading("Notification Snooze"),
          divider(),
          text(`Your notifications have been snoozed for the next ${snoozeDurationNumber} hours`)
        ])
      }
    })

    return snoozeDuration;
  }
}
