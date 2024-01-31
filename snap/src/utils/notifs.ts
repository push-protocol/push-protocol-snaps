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
      return feeds;
    } else {
      return { feeds: [] };
    }
  } catch (err) {
    console.error(`Error in getNotifications for ${address}:`, err);
    return { feeds: [] };
  }
};

/**
 * Filters notifications for a specific address.
 * @param address The Ethereum address to filter notifications for.
 * @returns An array of filtered notifications.
 */
export const filterNotifications = async (address: string) => {
  let fetchedNotifications = await getNotifications(address);
  fetchedNotifications = fetchedNotifications?.feeds;
  let notiffeeds: string[] = [];
  const currentepoch: number = Math.floor(Date.now() / 1000);
  if (fetchedNotifications.length > 0) {
    for (let i = 0; i < fetchedNotifications.length; i++) {
      let feedepoch = fetchedNotifications[i].payload.data.epoch;
      feedepoch = Number(feedepoch).toFixed(0);
      if (feedepoch > currentepoch - 60) {
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
};

/**
 * Fetches notifications for all stored addresses.
 * @returns An array of notifications.
 */
export const fetchAllAddrNotifs = async () => {
  const addresses = await fetchAddress();
  let notifs: string[] = [];
  if (addresses.length == 0) return notifs;
  const promises = addresses.map((address) => filterNotifications(address));
  const results = await Promise.all(promises);
  notifs = results.reduce((acc, curr) => acc.concat(curr), []);
  return notifs;
};

/**
 * Converts text by replacing tags and timestamps.
 * @param text The text to be converted.
 * @returns The converted text.
 */
function convertText(text:string) {
  let newText = text.replace(/\n/g, ' ');

  const tagRegex = /\[(d|s|t):([^\]]+)\]/g;
  newText = newText.replace(tagRegex, (match, tag, value) => value);

  const timestampRegex = /\[timestamp:\s*(\d+)\]/g;
  const processedTimestamps = new Set();
  newText = newText.replace(timestampRegex, (match, timestamp) => {
      if (processedTimestamps.has(timestamp)) {
          return '';
      } else {
          const date = new Date(parseInt(timestamp) * 1000);
          processedTimestamps.add(timestamp); 
          return "- " + date.toLocaleString(); 
      }
  });

  return newText;
}
