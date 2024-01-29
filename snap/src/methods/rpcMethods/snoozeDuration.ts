import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck, setSnoozeDuration, snoozeNotifs } from "../../utils";

export const snoozeDuration = async (): Promise<void> => {
  await SnapStorageCheck();

  const result = await snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      content: panel([
        heading("Snooze Notifications"),
        divider(),
        text(
          "Too many notifications to keep up with? You can temporarily snooze them to take a break. Approving will enable notification snooze."
        ),
      ]),
    },
  });

  if (result) {
    const snoozeDuration = await snoozeNotifs();
    setSnoozeDuration(Number(snoozeDuration));
  }
};
