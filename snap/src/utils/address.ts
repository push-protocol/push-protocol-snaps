import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck } from "./snapstoragecheck";
import { getSnapState, updateSnapState } from "./snapStateUtils";

const { ethers } = require("ethers");

export const handleAddAddress = async (address: string) => {
  const persistedData = await getSnapState({ encrypted: false});

  const isValidAddress = ethers.utils.isAddress(address);

  if (isValidAddress) {
    if (persistedData == null) {
      const data = {
        addresses: [address],
        popuptoggle: 0,
      };
      await updateSnapState({
        newState: data,
        encrypted: false
      });
    } else {
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
          encrypted: false
        });
      }
    }
  } else {
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

export const handleConfirmAddress = async () => {
  const persistedData = await getSnapState({ encrypted: false});
  if (persistedData != null) {
    const data = persistedData.addresses;
    let msg = "";
    for (let i = 0; i < data!.length; i++) {
      msg = msg + "🔹" + data![i] + "\n\n";
    }
    if (msg.length > 0) {
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Address added"),
            divider(),
            text(`Congratulations, Your address is now all set to receive notifications. \n\n Opt-in to your favourite channels now.`),
            text("Following addresses will receive notifications:"),
            divider(),
            text(`${msg}`),
          ]),
        },
      });
    } else {
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
    return snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([heading("Error"), text("No addresses added")]),
      },
    });
  }
};

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

  await updateSnapState({
    newState: newData,
    encrypted: false
  });
};

export const fetchAddress = async () => {
  const persistedData = await getSnapState({ encrypted: false});;
  if (persistedData != null) {
    const addresses = persistedData!.addresses;
    return addresses;
  } else {
    return [];
  }
};


export const snoozeNotifs = async () => {
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
    
    if (snoozeDurationNumber > 24) {
      snoozeDurationNumber = 24;
    } else if (snoozeDurationNumber === undefined) {
      snoozeDurationNumber = 0;
    }

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
