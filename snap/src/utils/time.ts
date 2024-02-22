/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns The current Unix timestamp.
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Formats a timestamp into a human-readable date and time string.
 * 
 * @param {number} timestamp - The timestamp to be formatted, represented as the number of milliseconds since the Unix epoch.
 * @returns {string} The formatted date and time string, including the day of the week, the date, the month, the year, and the time in 12-hour format with AM/PM.
 *                   If the timestamp is `null`, it returns an empty string with a space.
 * 
 * @example
 * // returns "Mon, Jul 20, 1969 at 8 PM"
 * formatTimestamp(0);
 */
export const formatTimestamp = (timestamp: number): string => {
  // Options for formatting the date and time.
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  let amPm = " ";
  let formattedDate = " ";

  // Check if the timestamp is not null
  if (timestamp != null) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    // Determine if the time is AM or PM based on the hour
    amPm = hours >= 12 ? "PM" : "AM";
    // Construct the formatted date string
    formattedDate =
      `-` +
      `${date.toLocaleDateString("en-US", options)} at ${
        date
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/:\d+ /, " ")
          .split(" ")[0]
      }`;
  }
  // Combine the formatted date and AM/PM strings
  const timeStamp = `${formattedDate}` + ` ` + `${amPm}`;
  return timeStamp;
}

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
