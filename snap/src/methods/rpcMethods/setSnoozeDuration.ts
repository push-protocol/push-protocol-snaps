import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { setSnoozeDuration } from "../../utils";
import { ApiParams, SnoozeDurationRequestParams } from "../../types";

/**
 * Sets the duration for which snooze functionality is enabled.
 * @param params - The parameters containing the snapshot state and request parameters.
 * @returns A Promise that resolves once the snooze duration is successfully set.
 */
export const setSnoozeEnabledDuration = async (
  params: ApiParams
): Promise<void> => {
  try {
    const { state, requestParams } = params;
    const requestParamsObj = requestParams as SnoozeDurationRequestParams;

    // Check if requestParamsObj is valid and contains an address
    if (requestParamsObj != null && requestParamsObj.snoozeDuration != null) {
      await setSnoozeDuration(state, requestParamsObj.snoozeDuration);
    } else {
      // Handle error reading input
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Error"),
            divider(),
            text("Error reading input, please try again"),
          ]),
        },
      });
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in setSnoozeDuration:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
