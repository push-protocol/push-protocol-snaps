import { heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck } from "../../utils";

export const removeSnoozeCronJob = async (): Promise<void> => {
  const persistedData = await SnapStorageCheck();
  const snoozeFlag = persistedData.popuptoggle;
  if (Number(snoozeFlag) >= 41) {
    const data = {
      addresses: persistedData.addresses,
      popuptoggle: 0,
    };

    await snap.request({
      method: "snap_manageState",
      params: { operation: "update", newState: data },
    });

    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Snooze Alert"),
          text(
            "Notification snooze has been turned off, you will start getting popup notifications from now on."
          ),
        ]),
      },
    });
  }
};
