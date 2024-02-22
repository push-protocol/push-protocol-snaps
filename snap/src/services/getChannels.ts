import { BASE_URL, CHAIN_ID } from "../config";
import { fetchGet } from "../utils";

interface IChannelInfo {
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
  alias_blockchain_id: string;
  is_alias_verified: number;
  blocked: number;
  alias_verification_event: string;
  activation_status: number;
  verified_status: number;
  subgraph_details: null; // Change this type if needed
  counter: null; // Change this type if needed
  timestamp: string;
  subgraph_attempts: number;
  channel_settings: string; // Change this type if needed
  minimal_channel_settings: string;
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
export const getChannelDetails = async (
  channelAddress: string
): Promise<IChannelInfo> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:${CHAIN_ID}:${channelAddress}`;
    // Fetch channel details
    const response = await fetchGet<IChannelInfo>(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getChannelDetails for ${channelAddress}:`, error);
    throw error;
  }
};
