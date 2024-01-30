import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck, fetchAllAddrNotifs } from "../../utils";

/**
 * Checks for activity using a cron job.
 * If there are no notifications or subscribed addresses, it displays an alert.
 * @returns {Promise<void>} - Resolves once the activity check is completed.
 */
export const checkActivityCronJob = async (): Promise<void> => {
  // Fetch all notifications for subscribed addresses
  const notifs = await fetchAllAddrNotifs();

  // Check the stored state for subscribed addresses
  let persistedData = await SnapStorageCheck();
  const addresses: string[] = persistedData.addresses;

  // If there are no notifications or subscribed addresses, display an alert
  if (notifs.length == 0 || addresses.length == 0) {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Activity Alert"),
          divider(),
          text(
            `Looks like it's been quiet since your last visit! Check out https://app.push.org/channels and opt-in to receive notifications.`
          ),
        ]),
      },
    });
  }
};
