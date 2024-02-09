/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns The current Unix timestamp.
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Converts an ISO 8601 timestamp to a Unix timestamp in milliseconds.
 * @param isoTimestamp The ISO 8601 timestamp to convert. (e.g., "2024-02-05T11:23:11.000Z")
 * @returns The Unix timestamp equivalent of the ISO 8601 timestamp.
 */
export const convertIsoToTimestamp = (isoTimestamp: string): number => {
  return Date.parse(isoTimestamp);
};

/**
 * Converts an epoch timestamp in seconds to milliseconds.
 * @param epochTimestamp The epoch timestamp in seconds to convert.
 * @returns The equivalent timestamp in milliseconds.
 */
export const convertEpochToMilliseconds = (epochTimestamp: string): number => {
  return parseFloat(epochTimestamp) * 1000;
};
