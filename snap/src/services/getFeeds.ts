import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

const CHANNELS_BASE_URL = `${BASE_URL}/users`;

export const getFeeds = async (channelAddress: string): Promise<any> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}/feeds`;
    const response = await fetchGet(url);
    return response;
  } catch (error) {
    console.error(`Error in getFeeds for ${channelAddress}:`, error);
    throw error;
  }
};