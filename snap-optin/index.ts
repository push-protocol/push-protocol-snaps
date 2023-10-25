import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

const snapOptIn = async (signer:PushAPI.SignerType,address:string, channelAddress: string) => {

    const defaultSnapOrigin='npm:@pushprotocol/snap'

    const res = await window.ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: "pushproto_optin" },
      },
    });
    
    if (res) {
      await PushAPI.channels.subscribe({
        signer: signer,
        channelAddress: `eip155:5:${channelAddress}`,
        userAddress: `eip155:5:${address}`,
        onSuccess: () => {
          console.log("opt in success");
        },
        onError: () => {
          console.error("opt in error");
        },
        env: ENV.PROD,
      });
    }
  };

  export default snapOptIn;