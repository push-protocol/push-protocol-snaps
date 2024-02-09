import { BASE_URL, CHAIN_ID } from "../config";
import { fetchGet } from "../utils";

/**
 * Type definition for the response object of the getFeeds function.
 */
export interface Payload {
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

export interface Feed {
  payload_id: number;
  sender: string;
  epoch: string;
  payload: Payload;
  source: string;
  etime: string | null;
}

export interface IFeeds {
  feeds: Feed[];
  itemCount: number;
}

/**
 * Type definition for the parameters object of the getFeeds function.
 */
export type GetFeedsParams = {
  userAddress: string; // The address of the user's channel
  page?: number; // Optional parameter for the page number, default is 1
  limit?: number; // Optional parameter for the limit, default is 10
};

// Base URL for users' feeds
const CHANNELS_BASE_URL = `${BASE_URL}/users`;

/**
 * Fetches feeds associated with a specific user channel.
 * @param params Object containing user address, page, and limit parameters.
 * @returns Feeds associated with the user channel.
 * @throws Error if there is an issue fetching feeds.
 */
export const getFeeds = async (params: GetFeedsParams): Promise<IFeeds> => {
  try {
    // Default values for page and limit
    const { userAddress, page = 1, limit = 10 } = params;

    // Construct the URL with query parameters
    const url = `${CHANNELS_BASE_URL}/eip155:${CHAIN_ID}:${userAddress}/feeds?page=${page}&limit=${limit}`;

    // Fetch feeds
    const response = await fetchGet<IFeeds>(url);
    return response;
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in getFeeds for ${params.userAddress}:`, error);
    throw error;
  }
};
