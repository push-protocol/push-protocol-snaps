import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

// Base URL for channels
const CHANNELS_BASE_URL = `${BASE_URL}/channels`;

/**
 * Fetches subscribers of a specific channel.
 * @param channelAddress The address of the channel.
 * @returns An array of subscribers for the channel.
 * @throws Error if there is an issue fetching subscribers.
 */
export const getSubscribers = async (channelAddress: string): Promise<string[]> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}/subscribers`;
    // Fetch subscribers
    const response = await fetchGet(url);
    // Extract and return subscribers from the response
    return response.subscribers;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getSubscribers for ${channelAddress}:`, error);
    throw error;
  }
};
