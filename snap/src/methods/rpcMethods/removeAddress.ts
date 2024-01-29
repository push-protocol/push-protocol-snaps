import { ethers } from "ethers";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, RemoveAddressRequestParams } from "../../types";
import { SnapStorageAddressCheck, handleConfirmAddress, handleRemoveAddress } from "../../utils";

export const removeAddress = async (params: ApiParams): Promise<void> => {
  const { requestParams } = params;
  const requestParamsObj = requestParams as RemoveAddressRequestParams;

  if (requestParamsObj != null && requestParamsObj.address != null) {
    let addresscheck = await SnapStorageAddressCheck(
      requestParamsObj.address
    );
    let isValidAddress = ethers.utils.isAddress(requestParamsObj.address);
    if (addresscheck == true && isValidAddress == true) {
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
        await handleRemoveAddress(requestParamsObj.address);
        await handleConfirmAddress();
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
};
