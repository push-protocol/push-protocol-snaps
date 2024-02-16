import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  fetchAllAddrNotifs,
  getCurrentTimestamp,
  getModifiedSnapState,
  getPopupsCountInLastHour,
  isSnoozeEnabled,
  isSnoozeAlertDisabled,
  notifyInMetamaskApp,
  snoozeNotifs,
  updateSnapState,
} from "../../utils";
import { LatestSnapState } from "../../types";
import { SNOOZE_ALERT_THRESHOLD } from "../../config";

/**
 * Executes a cron job to handle notifications.
 * Fetches notifications for all subscribed addresses,
 * updates the Snap state, and displays alerts or in-app notifications as needed.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
export const notifCronJob = async (state: LatestSnapState): Promise<void> => {
  try {
    // Fetch notifications for all subscribed addresses
    const notifs = await fetchAllAddrNotifs();

    // Display an alert for new notifications
    if (notifs.length > 0) {
      // if popups are already snoozed, then don't show popup
      if (isSnoozeEnabled(state)) {
      } else {
        const snoozeAlertDisabledStatus = isSnoozeAlertDisabled(state);
        const popupsCountInLastHour = getPopupsCountInLastHour(state);

        // show popup
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("You have a new notification!"),
              divider(),
              ...notifs.map((notif) => text(notif.popupMsg)),
            ]),
          },
        });

        const newState = {
          ...state,
          popupsTimestamp: [...state.popupsTimestamp, getCurrentTimestamp()],
        };
        await updateSnapState({
          newState: newState,
          encrypted: false,
        });

        // show snooze alert when snooze alert isn't disabled and popups count in last hour is more than 6
        if (!snoozeAlertDisabledStatus && popupsCountInLastHour > SNOOZE_ALERT_THRESHOLD) {
          // show snooze popup
          await snoozeNotifs();
        }
      }
    }

    const snapState = await getModifiedSnapState({ encrypted: false });
    const currentTimeStamp = getCurrentTimestamp();

    // Iterate over addresses in state
    for (const address in snapState.addresses) {
      // Check if the address is enabled
      if (snapState.addresses[address].enabled) {
        // Update the lastFeedsProcessedTimestamp for enabled addresses
        snapState.addresses[address].lastFeedsProcessedTimestamp =
          currentTimeStamp;
      }
    }
    await updateSnapState({
      newState: snapState,
      encrypted: false,
    });

    // Display in-app notifications
    await notifyInMetamaskApp(notifs);
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in notifCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
