import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

const CHANNELS_BASE_URL = `${BASE_URL}/channels`;

export const getChannelDetails = async (channelAddress: string): Promise<any> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}`;
    const response = await fetchGet(url);
    return response;
  } catch (error) {
    console.error(`Error in getChannelDetails for ${channelAddress}:`, error);
    throw error;
  }
};