import { getCurrentTimestamp } from "../../utils";
import { ApiParams } from "../../types";

/**
 * Sets the duration for which snooze functionality is enabled.
 * @param params - The parameters containing the snapshot state and request parameters.
 * @returns A Promise that resolves once the snooze duration is successfully set.
 */
export const getSnoozeInfo = async (
  params: ApiParams
): Promise<{
  enabled: boolean;
  duration: number;
}> => {
  try {
    const { state } = params;
    const currentTimestamp = getCurrentTimestamp();
    if (currentTimestamp >= state.snoozeInfo.enabledDuration) {
      return { enabled: false, duration: 0 };
    }
    return { enabled: true, duration: state.snoozeInfo.enabledDuration };
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in getSnoozeDuration:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
