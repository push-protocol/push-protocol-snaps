import { LatestSnapState } from "../types";
import { getCurrentTimestamp } from "./time";

export const sleep = (timeoutSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, timeoutSeconds));

// All getter functions of state here, so when version of state is changed, we only need to update these getters

/**
 * Retrieves an array of addresses that are marked as enabled in the SnapStateV1.
 * @param state - The SnapStateV1 object.
 * @returns An array of addresses that have the 'enabled' property set to true in the metadata.
 */
export const getEnabledAddresses = (state: LatestSnapState): string[] => {
  const enabledAddresses: string[] = []; // Array to store addresses that are marked as enabled.

  for (const [address, metadata] of Object.entries(state.addresses)) {
    if (metadata.enabled) {
      // Check if the 'enabled' property is true in the metadata.
      enabledAddresses.push(address); // If the address is marked as enabled, add it to the array.
    }
  }

  return enabledAddresses; // Return the array of enabled addresses.
};

/**
 * Checks if a specific address is marked as enabled in the SnapStateV1.
 * @param state - The SnapStateV1 object.
 * @param address - The address to check.
 * @returns True if the address is marked as enabled, otherwise false.
 */
export const isAddressEnabled = (
  state: LatestSnapState,
  address: string
): boolean => {
  // Retrieve the metadata for the specified address.
  const metadata = state.addresses[address];

  //Check if the metadata exists and the 'enabled' property is true.
  return !!metadata && metadata.enabled;
};

/**
 * Determines if the snooze functionality is currently enabled.
 * @param state - The latest snapshot state.
 * @returns A boolean indicating whether snooze is enabled.
 */
export const isSnoozeEnabled = (state: LatestSnapState): boolean => {
  const currentTimestamp = getCurrentTimestamp(); // Get the current timestamp.
  return state.snoozeInfo.enabledDuration > currentTimestamp; // Check if snooze is enabled.
};

/**
 * Determines if snooze alert is currently disabled.
 * @param state - The latest snapshot state.
 * @returns A boolean indicating whether snooze alert is disabled.
 */
export const isSnoozeAlertDisabled = (state: LatestSnapState): boolean => {
  const currentTimestamp = getCurrentTimestamp(); // Get the current timestamp.
  return state.snoozeInfo.disabledDuration > currentTimestamp; // Check if snooze for popups is disabled.
};

/**
 * Counts the number of popups shown in the last hour.
 * @param state - The latest snapshot state.
 * @returns The number of popups shown in the last hour.
 */
export const getPopupsCountInLastHour = (state: LatestSnapState): number => {
  const lastHourTimestamp = Date.now() - 60 * 60 * 1000; // Timestamp of one hour ago
  const count = getPopupsCountSinceTimestamp(state, lastHourTimestamp);
  return count;
};

/**
 * Counts the number of popups shown in the last hour.
 * @param state - The latest snapshot state.
 * @param time - The timestamp to count popups since.
 * @returns The number of popups shown in the last hour.
 */
export const getPopupsCountSinceTimestamp = (state: LatestSnapState, time: number): number => {
  if (state.popupsTimestamp.length === 0) {
    return 0;
  }

  const timestampToProcess = time; // Timestamp of one hour ago

  // Binary search to find the index of the timestamp that's less than timestampToProcess
  let left = 0;
  let right = state.popupsTimestamp.length - 1;
  let firstIndexInLastHour = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (state.popupsTimestamp[mid] < timestampToProcess) {
      firstIndexInLastHour = mid; // Update the index if current element is less than timestampToProcess
      left = mid + 1; // Move to the right side to search for larger elements
    } else {
      right = mid - 1; // Move to the left side to search for smaller elements
    }
  }

  // Calculate the number of timestamps within the last hour using the index
  const count = state.popupsTimestamp.length - (firstIndexInLastHour + 1);
  return count;
};
