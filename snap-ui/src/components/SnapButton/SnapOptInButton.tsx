"use client"
import React, { useEffect, useState } from 'react';
import MetaMask from '../../../public/metamask.svg'
import Image from 'next/image';
import * as  PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { FetchSignerResult } from 'wagmi/actions';

interface Props {
    address: any;
    signer: FetchSignerResult;
}

const SnapOptInButton = ({ address, signer }: Props) => {
    const defaultSnapOrigin = `local:http://localhost:8080`;
    const [optedIn, setOptedIn] = useState(false);

    useEffect(() => {
        checkSubscription();
    },[signer,address]);

    const checkSubscription = async () => {
        const url = `https://backend-staging.epns.io/apis/v1/channels/eip155:5:${address}/subscribers`;

        let response = await fetch(url, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });

        response = await response.json();

        const subscribers = response.subscribers;

        const signerAddress:string|undefined = await signer?.getAddress();

        if(subscribers.includes(signerAddress?.toLowerCase())) {
            setOptedIn(true);
        }

        console.log("Response", signerAddress?.toLowerCase());
    
    }

    const connectSnap = async (
        snapId = defaultSnapOrigin,
        params = {}
    ) => {
        await window.ethereum?.request({
            method: "wallet_requestSnaps",
            params: {
                [snapId]: params,
            },
        });
    };

    const installSnap = async () => {
        await connectSnap();
        const res = await window.ethereum?.request({
            method: "wallet_invokeSnap",
            params: {
                snapId: defaultSnapOrigin,
                request: { method: 'pushproto_optin' },
            },
        });

        console.log("Res", res);

        if (res) {
            setOptedIn(true);
            await PushAPI.channels.subscribe({
                signer: signer,
                channelAddress: `eip155:5:${address}`,
                userAddress: `eip155:5:${signer?.getAddress()}`, 
                onSuccess: () => {
                 console.log('opt in success');
                },
                onError: () => {
                  console.error('opt in error');
                },
                env: ENV.STAGING
              })
        }
    }

    return (
        <div>
            {optedIn ? (
                <div className="flex bg-white border border-[#BAC4D6] text-[#657795] font-normal justify-center text-sm w-full py-3 px-6 rounded-lg">
                    <p className='pl-2'>
                        Opted-In
                    </p>
                </div>
            ) : (
                <button className="flex gap-2 bg-[#E20880] hover:opacity-90 border text-[#fff] font-normal text-sm w-full py-3 px-6 rounded-lg" onClick={()=>installSnap()}>
                    <Image src={MetaMask} alt='MetaMask Logo' height="20" width="20" />
                    <p className=''>
                        Opt-In With Snap
                    </p>
                </button>
            )}
        </div>
    );
};

export default SnapOptInButton;