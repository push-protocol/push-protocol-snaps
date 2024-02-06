import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import axios from 'axios';

/**
 * Opt-in a user to a Push Notification channel using Snaps.
 * @param signer The signer type used for channel subscription.
 * @param address The user's Ethereum address.
 * @param channelAddress The address of the channel to opt into.
 * @param chainid The ID of the blockchain chain.
 */
const snapOptIn = async (signer: PushAPI.SignerType, address: string, channelAddress: string, chainid: string) => {

    // Define the default Snap origin
    const defaultSnapOrigin = 'npm:@pushprotocol/snap'

    // Request user opt-in using the wallet_invokeSnap method
    const res = await window.ethereum?.request({
        method: "wallet_invokeSnap",
        params: {
            snapId: defaultSnapOrigin,
            request: {
                method: "pushproto_optin",
                params: {
                    channelAddress: channelAddress
                }
            },
        },
    });

    // If user opt-in is successful, subscribe the user to the channel
    if (res) {
        await PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: `eip155:${chainid}:${channelAddress}`,
            userAddress: `eip155:${chainid}:${address}`,
            onSuccess: () => {
                console.log("opt in success");
            },
            onError: () => {
                console.error("opt in error");
            },
            env: ENV.PROD,
        });

        // Check if the user has only one subscription and trigger the first channel opt-in
        let subscribed = await axios.get(`https://backend-staging.epns.io/apis/v1/users/eip155:${chainid}:${address}/subscriptions`);
        subscribed = subscribed.data.subscriptions;
        if (subscribed.length == 1) {
            await window.ethereum?.request({
                method: "wallet_invokeSnap",
                params: {
                    snapId: defaultSnapOrigin,
                    request: {
                        method: "pushproto_firstchanneloptin"
                    },
                },
            });
        }
    }
};

export default snapOptIn;
