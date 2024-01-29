import { divider, heading, panel, text } from "@metamask/snaps-ui";

export const welcomeDialog = async (): Promise<boolean> => {
  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([
        heading("Welcome to Push Notification Snap!"),
        divider(),
        text("🔔 Start getting notifications by opting into channels"),
      ]),
    },
  });
  return true;
};
