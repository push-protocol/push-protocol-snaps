import { heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, TogglePopupRequestParams } from "../../types";
import { popupToggle, SnapStorageCheck } from "../../utils";

export const togglePopup = async (params: ApiParams): Promise<void> => {
  const { requestParams } = params;
  const requestParamsObj = requestParams as TogglePopupRequestParams;

  let persistedData = await SnapStorageCheck();
  let popuptoggle = persistedData.popuptoggle;

  if (Number(popuptoggle) <= 25) {
    popupToggle(27);

    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Snooze Pop-ups On"),
          text("Disable Notification Pop-ups from Push Snap"),
        ]),
      },
    });
  } else {
    popupToggle(0);

    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Snooze Pop-ups Off"),
          text("Enable Notification Pop-ups from Push Snap"),
        ]),
      },
    });
  }
};
