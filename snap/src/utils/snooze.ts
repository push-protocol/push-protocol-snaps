import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { getModifiedSnapState, updateSnapState } from "./snapStateUtils";
import { getCurrentTimestamp } from "./time";
import { SNOOZE_DISABLE_DURATION } from "../config";
import { LatestSnapState } from "../types";

/**
 * Sets the snooze duration for notifications.
 * @returns The snooze duration in hours.
 */
export const snoozeNotifs = async () => {
  // Prompt the user to set the snooze duration
  try {
    const state = await getModifiedSnapState({ encrypted: false });

    const snoozeDuration = await snap.request({
      method: "snap_dialog",
      params: {
        type: "prompt",
        content: panel([
          heading("Notification Snooze"),
          text(
            "**Hey there! 🔔 It seems like you're receiving a lot of notifications. Would you like to enable snooze to take a break?**"
          ),
          divider(),
          text(
            "How long would you like to snooze notifications? You can snooze for 1 to 72 hours."
          ),
        ]),
        placeholder: "Snooze duration in Hours (e.g. 6)",
      },
    });

    await setSnoozeDuration(state, snoozeDuration as string | null); // prompt return type is string | null
  } catch (err) {
    console.error("Error in snooze functionality", err);
  }
};

export const setSnoozeDuration = async (
  state: LatestSnapState,
  snoozeDuration: string | null
) => {
  try {
    // Sanitize snoozeDuration
    let snoozeDurationNumber: number | null;
    if (typeof snoozeDuration === "string") {
      snoozeDurationNumber = parseInt(snoozeDuration.trim(), 10);
      // Ensure snooze duration is within valid range
      if (
        isNaN(snoozeDurationNumber) ||
        snoozeDurationNumber < 1 ||
        snoozeDurationNumber > 72
      ) {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Invalid Duration"),
              divider(),
              text(
                `Please enter a valid snooze duration between 1 and 72 hours.`
              ),
            ]),
          },
        });
        return;
      }
    } else {
      // disable snooze popup for next 24 hrs
      const next24HrsTimestamp =
        getCurrentTimestamp() + SNOOZE_DISABLE_DURATION * 60 * 60 * 1000;
      const newState = {
        ...state,
        snoozeInfo: {
          ...state.snoozeInfo,
          disabledDuration: next24HrsTimestamp,
        },
      };
      await updateSnapState({
        newState: newState,
        encrypted: false,
      });
      return;
    }

    const nextSnoozeTimestamp =
      getCurrentTimestamp() + snoozeDurationNumber * 60 * 60 * 1000;
    const newState = {
      ...state,
      snoozeInfo: {
        ...state.snoozeInfo,
        enabledDuration: nextSnoozeTimestamp,
      },
    };
    await updateSnapState({
      newState: newState,
      encrypted: false,
    });

    // Display an alert confirming the snooze duration
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Snooze Enabled"),
          divider(),
          text(
            `Notifications will be snoozed for ${snoozeDurationNumber} hours. You can manage snooze settings on **app.push.org/snap**`
          ),
        ]),
      },
    });
  } catch (err) {
    console.error("Error in snooze functionality", err);
  }
};
