/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns The current Unix timestamp.
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

export const formatTimestamp = (timestamp: number): string => {
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
  if (timestamp != null) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    amPm = hours >= 12 ? "PM" : "AM";
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
