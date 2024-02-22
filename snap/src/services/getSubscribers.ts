import { BASE_URL, CHAIN_ID } from "../config";
import { fetchGet } from "../utils";

interface ISubscribers {
  itemcount: number;
  subscribers: string[];
}

// Base URL for channels
const CHANNELS_BASE_URL = `${BASE_URL}/channels`;

/**
 * Fetches subscribers of a specific channel.
 * @param channelAddress The address of the channel.
 * @returns An array of subscribers for the channel.
 * @throws Error if there is an issue fetching subscribers.
 */
export const getSubscribers = async (
  channelAddress: string
): Promise<ISubscribers> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:${CHAIN_ID}:${channelAddress}/subscribers`;
    // Fetch subscribers
    const response = await fetchGet<ISubscribers>(url);
    // Extract and return subscribers from the response
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getSubscribers for ${channelAddress}:`, error);
    throw error;
  }
};
