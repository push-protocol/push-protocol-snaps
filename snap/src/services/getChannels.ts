import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

// Base URL for channels
const CHANNELS_BASE_URL = `${BASE_URL}/channels`;

/**
 * Fetches details of a specific channel.
 * @param channelAddress The address of the channel.
 * @returns Details of the channel.
 * @throws Error if there is an issue fetching channel details.
 */
export const getChannelDetails = async (channelAddress: string): Promise<any> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}`;
    // Fetch channel details
    const response = await fetchGet(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getChannelDetails for ${channelAddress}:`, error);
    throw error;
  }
};
