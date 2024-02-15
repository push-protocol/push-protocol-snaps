import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  fetchAllAddrNotifs,
  getCurrentTimestamp,
  getModifiedSnapState,
  groupNotifications,
  notifyInMetamaskApp,
  updateSnapState,
} from "../../utils";

/**
 * Executes a cron job to handle notifications.
 * Fetches notifications for all subscribed addresses,
 * updates the Snap state, and displays alerts or in-app notifications as needed.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
export const notifCronJob = async (): Promise<void> => {
  try {
    // Fetch notifications for all subscribed addresses
    const notif = await fetchAllAddrNotifs();

    const notifs = await groupNotifications(notif);

    console.log(notifs, "<= notifs");

    if (Object.keys(notifs).length > 0) {
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("You have a new notification!"),
            divider(),
            ...Object.keys(notifs).map((notif) => {
              const addr = `${notif.slice(0, 6)}...${notif.slice(-6)}`;
              // notif is a key

              return panel([
                text(`**${addr}**`),
                ...notifs[notif].map((n) => {
                  return panel([
                    text(`**${n.channelName}**`),
                    text(n.msgData.popupMsg),
                    text(`${n.msgData.timestamp}`),
                  ]);
                }),
                divider(),
              ]);
            }),
          ]),
        },
      });
    }

    // Display in-app notifications
    await notifyInMetamaskApp(notif);

    const state = await getModifiedSnapState({ encrypted: false });
    const currentTimeStamp = getCurrentTimestamp();

    // Iterate over addresses in state
    for (const address in state.addresses) {
      // Check if the address is enabled
      if (state.addresses[address].enabled) {
        // Update the lastFeedsProcessedTimestamp for enabled addresses
        state.addresses[address].lastFeedsProcessedTimestamp = currentTimeStamp;
      }
    }
    await updateSnapState({
      newState: state,
      encrypted: false,
    });
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in notifCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
