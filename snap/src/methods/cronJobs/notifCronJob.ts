import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  fetchAllAddrNotifs,
  getModifiedSnapState,
  popupHelper,
  sleep,
} from "../../utils";

/**
 * Executes a cron job to handle notifications.
 * Fetches notifications for all subscribed addresses,
 * updates the Snap state, and displays alerts or in-app notifications as needed.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
export const notifCronJob = async (): Promise<void> => {
  // Fetch notifications for all subscribed addresses
  const notifs = await fetchAllAddrNotifs();

  // Generate popup messages based on notifications
  const msgs = popupHelper(notifs);

  // Just modify the state version
  await getModifiedSnapState({ encrypted: false });

  // if user is recieving more than 25 notifications, then remind them to turn on snooze
  // if (Number(popuptoggle) <= 15 && currentTimeEpoch > Number(persistedData.snoozeDuration)) {

  // Display an alert for new notifications
  if (msgs.length > 0) {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("You have a new notification!"),
          divider(),
          ...msgs.map((msg) => text(msg)),
        ]),
      },
    });
  }

  // } else if (Number(popuptoggle) == 16 && currentTimeEpoch >= Number(persistedData.snoozeDuration)) {
  //   await SnapStorageCheck();

  //   const result = await snap.request({
  //     method: 'snap_dialog',
  //     params: {
  //       type: 'confirmation',
  //       content: panel([
  //         heading('Snooze Notifications'),
  //         divider(),
  //         text('Too many notifications to keep up with? You can temporarily snooze them to take a break. Approving will enable notification snooze.'),
  //       ]),
  //     },
  //   });

  //   if (result) {
  //     const snoozeDuration = await snoozeNotifs();
  //     setSnoozeDuration(Number(snoozeDuration));
  //   }
  //   break;
  // }

  // Display in-app notifications

  if (msgs.length > 0) {
    const maxlength = msgs.length > 11 ? 11 : msgs.length;
    for (let i = 0; i < maxlength; i++) {
      let msg = msgs[i];
      msg = String(msg);
      msg = msg.slice(0, 47);
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg,
        },
      });
      await sleep(5000); // Wait for 5 seconds between notifications
    }
  }
};
