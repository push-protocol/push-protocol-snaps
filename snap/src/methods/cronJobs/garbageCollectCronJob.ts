import { LatestSnapState } from "../../types";
import { getPopupsCountSinceTimestamp, updateSnapState } from "../../utils";

/**
 * Performs garbage collection on the snapshot state by removing popups older than two hours.
 * @param state - The latest snapshot state.
 * @returns A promise that resolves when the garbage collection is complete.
 */
export const garbageCollectCronJob = async (
  state: LatestSnapState
): Promise<void> => {
  try {
    const updatedState = { ...state };
    if (updatedState.popupsTimestamp.length === 0) return;

    // need to remove all popupsTimestamp storage that came two hours ago
    const lastTwoHourTimestamp = Date.now() - 2 * 60 * 60 * 1000; // Timestamp of two hours ago
    const popupsCountSinceLastTwoHours = getPopupsCountSinceTimestamp(
      updatedState,
      lastTwoHourTimestamp
    ); // Get the number of popups shown since two hours ago

    // Calculate the number of popups to remove
    const popupsToRemove = Math.max(
      0,
      updatedState.popupsTimestamp.length - popupsCountSinceLastTwoHours
    );

    // Remove the extra popups from the beginning of the array
    updatedState.popupsTimestamp.splice(0, popupsToRemove);

    // update the state
    await updateSnapState({
      newState: updatedState,
      encrypted: false,
    });
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in garbageCollectCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
