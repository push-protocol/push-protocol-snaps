import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import axios from 'axios';

const snapOptIn = async (signer:PushAPI.SignerType,address:string, channelAddress: string, chainid: string) => {

    const defaultSnapOrigin='npm:@pushprotocol/snap'

    const res = await window.ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: "pushproto_optin", params:{
            channelAddress: channelAddress
        } },
      },
    });

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

      let subscribed = await axios.get(`https://backend-staging.epns.io/apis/v1/users/eip155:${chainid}:${address}/subscriptions`);
      subscribed = subscribed.data.subscriptions;
      if(subscribed.length == 1){
        await window.ethereum?.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: defaultSnapOrigin,
            request: { method: "pushproto_firstchanneloptin"},
          },
        });
      }
    }
  };

  export default snapOptIn;