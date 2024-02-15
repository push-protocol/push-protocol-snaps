import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { getModifiedSnapState, updateSnapState } from "./snapStateUtils";
import { getCurrentTimestamp } from "./time";
import { SNOOZE_DISABLE_DURATION } from "../config";

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
          heading("Set snooze duration"),
          divider(),
          text("Customize your snooze from 1 to 72 hours and stay focused."),
        ]),
        placeholder: "Snooze duration in Hours (e.g. 6)",
      },
    });

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
              heading("Error"),
              divider(),
              text(`Invalid input. Please enter a number between 1 and 72`),
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
          heading("Notification Snooze"),
          divider(),
          text(
            `Your notifications have been snoozed for the next ${snoozeDurationNumber} hours`
          ),
        ]),
      },
    });
  } catch (err) {
    console.error('Error in snooze functionality', err);
  }
};
