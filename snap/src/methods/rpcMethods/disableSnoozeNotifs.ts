import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { updateSnapState } from "../../utils";
import { ApiParams } from "../../types";
import { getSnoozeInfo } from "./getSnoozeInfo";

/**
 * Disables the snooze functionality for notifications.
 * @param params - The API parameters containing the snapshot state.
 * @returns A Promise that resolves once the snooze functionality is disabled.
 */
export const disableSnoozeNotifs = async (params: ApiParams): Promise<void> => {
    try {
      const { state } = params;
      const snoozeInfo = await getSnoozeInfo(params);
  
      // Check if snooze is currently enabled
      if (snoozeInfo.enabled) {
        // Update the state to disable snooze
        const newState = {
          ...state,
          snoozeInfo: {
            ...state.snoozeInfo,
            enabledDuration: 0,
          },
        };
        await updateSnapState({
          newState: newState,
          encrypted: false,
        });
  
        // Display success message
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Snooze Disabled"),
              divider(),
              text(
                `Snooze has been successfully disabled for your notifications.`
              ),
            ]),
          },
        });
      } else {
        // Display message indicating snooze is already disabled
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("Snooze Already Disabled"),
              divider(),
              text(
                `The snooze functionality is already disabled. No changes were made.`
              ),
            ]),
          },
        });
      }
    } catch (error) {
      // Handle or log the error as needed
      console.error("Error in disableSnoozeNotifs:", error);
      // Optionally rethrow the error if you want it to propagate further
      throw error;
    }
  };
  
