import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

// Base URL for users' feeds
const CHANNELS_BASE_URL = `${BASE_URL}/users`;

/**
 * Fetches feeds associated with a specific user channel.
 * @param channelAddress The address of the user's channel.
 * @returns Feeds associated with the user channel.
 * @throws Error if there is an issue fetching feeds.
 */
export const getFeeds = async (channelAddress: string): Promise<any> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}/feeds`;
    // Fetch feeds
    const response = await fetchGet(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getFeeds for ${channelAddress}:`, error);
    throw error;
  }
};
