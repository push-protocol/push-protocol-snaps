import { getFeeds } from "../services";
import { fetchAddress } from "./address";
import { ethers } from "ethers";

/**
 * Retrieves notifications for a specific address.
 * @param address The Ethereum address to retrieve notifications for.
 * @returns An array of notifications.
 */
export const getNotifications = async (address: string) => {
  try {
    const addressValidation = ethers.utils.isAddress(address);

    if (addressValidation) {
      // Retrieve feeds using the service function
      const feeds = await getFeeds(address);
      return feeds.feeds;
    } else {
      console.warn(`Invalid Ethereum address: ${address}`);
      throw Error(`Error in getNotifications for ${address}: Invalid Ethereum address`);
    }
  } catch (err) {
    console.error(`Error in getNotifications for ${address}:`, err);
    throw err;
  }
};

/**
 * Retrieves notifications for a given address and filters them based on the epoch.
 * @param address - The Ethereum address.
 * @returns An array of filtered notification messages.
 */
export const filterNotifications = async (
  address: string
): Promise<string[]> => {
  try {
    const fetchedNotifications = await getNotifications(address);
    let notiffeeds: string[] = [];
    const currentEpoch: number = Math.floor(Date.now() / 1000);

    if (fetchedNotifications.length > 0) {
      for (let i = 0; i < fetchedNotifications.length; i++) {
        const feedEpoch = Number(fetchedNotifications[i].payload.data.epoch);

        if (feedEpoch > currentEpoch - 60) {
          const msg =
            fetchedNotifications[i].payload.data.app +
            " : " +
            convertText(fetchedNotifications[i].payload.data.amsg);
          notiffeeds.push(msg);
        }
      }
    }

    notiffeeds = notiffeeds.reverse();
    return notiffeeds;
  } catch (error) {
    console.error(`Error in filterNotifications for ${address}:`, error);
    throw error;
  }
};

/**
 * Fetches notifications for all stored addresses.
 * @returns An array of notifications for all stored addresses.
 */
export const fetchAllAddrNotifs = async (): Promise<string[]> => {
  try {
    const addresses = await fetchAddress();
    let notifs: string[] = [];

    if (addresses.length === 0) {
      return notifs;
    }

    const promises = addresses.map((address) => filterNotifications(address));
    const results = await Promise.all(promises);
    notifs = results.reduce((acc, curr) => acc.concat(curr), []);

    return notifs;
  } catch (error) {
    console.error("Error in fetchAllAddrNotifs:", error);
    throw error;
  }
};

/**
 * Converts text by replacing tags and timestamps.
 * @param text The text to be converted.
 * @returns The converted text.
 */
const convertText = (text: string): string => {
  try {
    let newText = text.replace(/\n/g, " ");

    const tagRegex = /\[(d|s|t):([^\]]+)\]/g;
    newText = newText.replace(tagRegex, (match, tag, value) => value);

    const timestampRegex = /\[timestamp:\s*(\d+)\]/g;
    const processedTimestamps = new Set<number>();
    newText = newText.replace(timestampRegex, (match, timestamp) => {
      const timestampValue = parseInt(timestamp);
      if (!isNaN(timestampValue) && !processedTimestamps.has(timestampValue)) {
        const date = new Date(timestampValue * 1000);
        processedTimestamps.add(timestampValue);
        return `- ${date.toLocaleString()}`;
      } else {
        return "";
      }
    });

    return newText;
  } catch (error) {
    console.error("Error in convertText:", error);
    // Handle the error or rethrow it if needed
    throw error;
  }
};

