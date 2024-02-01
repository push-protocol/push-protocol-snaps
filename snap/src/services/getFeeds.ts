import { BASE_URL } from "../config";
import { fetchGet } from "../utils";

interface Payload {
  data: {
    app: string;
    sid: string;
    url: string;
    acta: string;
    aimg: string;
    amsg: string;
    asub: string;
    icon: string;
    type: number;
    epoch: string;
    etime: string | null;
    hidden: string;
    silent: string;
    sectype: string | null;
    additionalMeta: unknown | null;
  };
  recipients: string;
  notification: {
    body: string;
    title: string;
  };
  verificationProof: string;
}

interface Feed {
  payload_id: number;
  sender: string;
  epoch: string;
  payload: Payload;
  source: string;
  etime: string | null;
}

interface IFeeds {
  feeds: Feed[];
  itemCount: number;
}

// Base URL for users' feeds
const CHANNELS_BASE_URL = `${BASE_URL}/users`;

/**
 * Fetches feeds associated with a specific user channel.
 * @param channelAddress The address of the user's channel.
 * @returns Feeds associated with the user channel.
 * @throws Error if there is an issue fetching feeds.
 */
export const getFeeds = async (channelAddress: string): Promise<IFeeds> => {
  try {
    const url = `${CHANNELS_BASE_URL}/eip155:1:${channelAddress}/feeds`;
    // Fetch feeds
    const response = await fetchGet<IFeeds>(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getFeeds for ${channelAddress}:`, error);
    throw error;
  }
};
