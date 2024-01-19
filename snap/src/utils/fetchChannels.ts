import { ethers } from "ethers";

export const fetchChannels = async (channelAddress: string) => {
    const url = `https://backend-staging.epns.io/apis/v1/channels/eip155:11155111:${channelAddress}/subscribers`;

    const channelNameUrl = `https://backend-staging.epns.io/apis/v1/channels/eip155:11155111:0x28a292f4dC182492F7E23CFda4354bff688f6ea8`

    let response = await fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let channelNameResponse = await fetch(channelNameUrl, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });

    channelNameResponse = await channelNameResponse.json();

    const channelName = channelNameResponse.name;

    let res:String[] = await ethereum.request({ method: "eth_requestAccounts" });

    response = await response.json();

    const subscribers = response.subscribers;

    let unsubscribedAccounts = [];

    for (let i = 0; i < res.length; i++) {
        if (!subscribers.includes(res[i])) {
            unsubscribedAccounts.push(res[i]);
        }
    }
    return {unsubscribedAccounts,channelName};
};
