import { getChannelDetails, getSubscribers } from "../services";

/**
 * Fetches channel details and subscribers for a given channel address.
 * @param channelAddress The address of the channel.
 * @returns An object containing unsubscribed accounts and channel name.
 * @throws Error if there is an issue fetching channels.
 */
export const fetchChannels = async (channelAddress: string) => {
  try {
    // Use the service functions to fetch subscribers and channel details
    const subscribers = await getSubscribers(channelAddress);
    const channelDetails = await getChannelDetails(channelAddress);

    // Extract the required information from channel details
    const channelName = channelDetails.name;

    // Request Ethereum accounts from the user
    const res: string[] = await ethereum.request({ method: "eth_requestAccounts" });

    // Retrieve channel subscribers
    const channelSubscribers = subscribers;

    // Find unsubscribed accounts
    const unsubscribedAccounts = [];

    // Check each Ethereum account if it is subscribed to the channel
    for (let i = 0; i < res.length; i++) {
      if (!channelSubscribers.includes(res[i])) {
        unsubscribedAccounts.push(res[i]);
      }
    }

    // Return object containing unsubscribed accounts and channel name
    return { unsubscribedAccounts, channelName };
  } catch (error) {
    // Log and rethrow error if encountered
    console.error(`Error in fetchChannels for ${channelAddress}:`, error);
    throw error;
  }
};
