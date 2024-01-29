import { getChannelDetails, getSubscribers } from "../services";

export const fetchChannels = async (channelAddress: string) => {
  try {
    // Use the service functions
    const subscribers = await getSubscribers(channelAddress);
    const channelDetails = await getChannelDetails(channelAddress);

    // Extract the required information
    const channelName = channelDetails.name;

    let res: string[] = await ethereum.request({ method: "eth_requestAccounts" });

    const channelSubscribers = subscribers;

    let unsubscribedAccounts = [];

    for (let i = 0; i < res.length; i++) {
      if (!channelSubscribers.includes(res[i])) {
        unsubscribedAccounts.push(res[i]);
      }
    }

    return { unsubscribedAccounts, channelName };
  } catch (error) {
    console.error(`Error in fetchChannels for ${channelAddress}:`, error);
    throw error;
  }
};
