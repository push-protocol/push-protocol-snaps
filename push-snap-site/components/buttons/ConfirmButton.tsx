import { useSignMessage } from "wagmi";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function ConfirmButton() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const defaultSnapOrigin = `local:http://localhost:8080`;

  const sendHello = async (address: string) => {
    await window.ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: "hello", params: { address: address } },
      },
    });
  };

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message:
      `Confirm your Address ${address}, \n this will be added to MetaMask for sending notifications`,
  });

  const confirmAddition=async()=>{
    signMessage();
    if(isSuccess){
    sendHello(String(address));}
    if(isError){
      console.log('error')
    }
  }

  return (
    <button
      className="flex bg-white text-black font-bold text-sm w-max p-2 rounded-lg border-2 border-text-secondary ring-1 ring-white"
      onClick={() => confirmAddition()}
    >
      Confirm
    </button>
  );
}
