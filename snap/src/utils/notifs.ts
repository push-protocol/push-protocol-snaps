import { Feed, getFeeds } from "../services";
import { fetchAddress } from "./address";
import { ethers } from "ethers";
import { getModifiedSnapState, updateSnapState } from "./snapStateUtils";
import { convertEpochToMilliseconds } from "./time";
import { INotification } from "../types";

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
      throw Error(
        `Error in getNotifications for ${address}: Invalid Ethereum address`
      );
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
): Promise<INotification[]> => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });
    const fetchedNotifications = await getNotifications(address);
    let notiffeeds: Feed[] = [];
    const processedLastEpoch =
      state.addresses[address].lastFeedsProcessedTimestamp;

    for (let i = 0; i < fetchedNotifications.length; i++) {
      const feedEpoch = convertEpochToMilliseconds(
        fetchedNotifications[i].payload.data.epoch
      );

      if (feedEpoch > processedLastEpoch) {
        notiffeeds.push(fetchedNotifications[i]);
      }
    }
    notiffeeds = notiffeeds.reverse();
    const formattedFeeds = getFormattedNotifList(notiffeeds, address);
    return formattedFeeds;
  } catch (error) {
    console.error(`Error in filterNotifications for ${address}:`, error);
    throw error;
  }
};

/**
 * Fetches notifications for all stored addresses.
 * @returns An array of notifications for all stored addresses.
 */
export const fetchAllAddrNotifs = async (): Promise<INotification[]> => {
  try {
    const addresses = await fetchAddress();
    let notifs: INotification[] = [];

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
 * Formats the notifs from Feed format into INotification format to be used in snap
 * @param address - The Ethereum address.
 * @returns An array of formatted notifs.
 */
export const getFormattedNotifList = (
  notifList: Feed[],
  address: string
): INotification[] => {
  const formattedNotifList = notifList.map((notif) => {
    const emoji = notif.payload.data.aimg ? `📸` : `🔔`;
    const msg =
      emoji +
      notif.payload.data.app +
      ": " +
      convertText(notif.payload.data.amsg);

    return {
      address: address,
      timestamp: convertEpochToMilliseconds(notif.payload.data.epoch),
      notification: {
        body: notif.payload.notification.body,
        title: notif.payload.notification.title,
      },
      popupMsg: msg,
      inAppNotifMsg: msg.slice(0, 47),
    };
  });
  return formattedNotifList;
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

/**
 * Adds in App notifications in Metamask.
 * @param notifs Array of notifications to be in proper format.
 */
export const notifyInMetamaskApp = async (notifs: INotification[]) => {
  try {
    const state = await getModifiedSnapState({ encrypted: false });
    const maxToAdd = 5;
    const pendingNotifsCount = state.pendingInAppNotifs.length;

    // Determine how many notifications to add from pendingInAppNotifs
    const pendingNotifsToAdd = Math.min(pendingNotifsCount, maxToAdd);

    // Add pending notifications from pendingInAppNotifs
    for (let i = 0; i < pendingNotifsToAdd; i++) {
      const msg = state.pendingInAppNotifs.shift(); // Remove the first pending notification
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg.message,
        },
      });
    }

    // Calculate the remaining number of notifications to add
    const remainingToAdd = maxToAdd - pendingNotifsToAdd;

    // Add notifications from notifs array
    for (let i = 0; i < remainingToAdd && i < notifs.length; i++) {
      const msg = notifs[i].inAppNotifMsg;
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg,
        },
      });
    }

    // Add remaining notifications to pendingInAppNotifs if any
    if (notifs.length > remainingToAdd) {
      const remainingNotifs = notifs.slice(remainingToAdd);
      state.pendingInAppNotifs.push(
        ...remainingNotifs.map((notif) => {
          return {
            address: notif.address,
            message: notif.inAppNotifMsg,
            timestamp: notif.timestamp,
          };
        })
      );
    }

    await updateSnapState({
      newState: state,
      encrypted: false,
    });
  } catch (error) {
    console.error("Error in notifyInMetamaskApp:", error);
    throw error;
  }
};
