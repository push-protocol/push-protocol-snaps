import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

const CHANNELS_BASE_URL = `${BASE_URL}/channels`;

export const getSubscribers = async (channelAddress: string): Promise<string[]> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}/subscribers`;
    const response = await fetchGet(url);
    return response.subscribers;
  } catch (error) {
    console.error(`Error in getSubscribers for ${channelAddress}:`, error);
    throw error;
  }
};