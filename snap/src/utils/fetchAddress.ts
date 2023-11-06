import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck } from "../helper/snapstoragecheck";

const { ethers } = require("ethers");

export const addAddress = async (address: string) => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });

  const isValidAddress = ethers.utils.isAddress(address);

  if (isValidAddress) {
    if (persistedData == null) {
      const data = {
        addresses: [address],
        popuptoggle: 0,
        userReplyAddresses: [],
      };
      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
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
          userReplyAddresses: [],
        };
        await snap.request({
          method: "snap_manageState",
          params: { operation: "update", newState: data },
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

// function to add addresses to which user wants to reply in the snap
export const addReplyAddress = async (address: string) => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });

  const isValidAddress = ethers.utils.isAddress(address);

  if (isValidAddress) {
    if (persistedData == null) {
      const data = {
        userReplyAddresses: [address],
        popuptoggle: 0,
        addresses: [],
      };
      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
      });
    } else {
      const replyAddrList = persistedData.userReplyAddresses;
      const popuptoggle = persistedData.popuptoggle;
      if (replyAddrList!.includes(address)) {
        return;
      } else {
        replyAddrList!.push(address);
        const data = {
          userReplyAddresses: replyAddrList,
          popuptoggle: popuptoggle,
          addresses: [],
        };
        await snap.request({
          method: "snap_manageState",
          params: { operation: "update", newState: data },
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

export const confirmAddress = async () => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
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

export const removeAddress = async (address: string) => {
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

  await snap.request({
    method: "snap_manageState",
    params: { operation: "update", newState: newData },
  });
};

export const fetchAddress = async () => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
  if (persistedData != null) {
    const addresses = persistedData!.addresses;
    return addresses;
  } else {
    return [];
  }
};
