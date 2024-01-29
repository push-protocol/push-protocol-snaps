import { ethers } from "ethers";
import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { AddAddressRequestParams, ApiParams } from "../../types";
import { SnapStorageAddressCheck, handleAddAddress, handleConfirmAddress } from "../../utils";

export const addAddress = async (params: ApiParams): Promise<void> => {
  const { requestParams } = params;
  const requestParamsObj = requestParams as AddAddressRequestParams;

  if (requestParamsObj != null && requestParamsObj.address != null) {
    let addresscheck = await SnapStorageAddressCheck(requestParamsObj.address);
    let isValidAddress = ethers.utils.isAddress(requestParamsObj.address);
    if (addresscheck == false && isValidAddress == true) {
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
        await handleAddAddress(requestParamsObj.address);
        await handleConfirmAddress();
      } else {
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
