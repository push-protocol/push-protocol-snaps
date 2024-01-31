import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

interface Channel {
  id: number;
  channel: string;
  ipfshash: string;
  name: string;
  info: string;
  url: string;
  icon: string;
  processed: number;
  attempts: number;
  alias_address: string;
  alias_verification_event: any; 
  is_alias_verified: number;
  alias_blockchain_id: string;
  activation_status: number;
  verified_status: number;
  timestamp: string;
  blocked: number;
  counter: any; 
  subgraph_details: any; 
  subgraph_attempts: number;
  channel_settings: any;
  minimal_channel_settings: any; 
  subscriber_count: number;
}


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
    const response : Channel = await fetchGet(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getChannelDetails for ${channelAddress}:`, error);
    throw error;
  }
};
