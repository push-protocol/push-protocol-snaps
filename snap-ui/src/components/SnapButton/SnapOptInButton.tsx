"use client"
import React, { useEffect, useState } from 'react';
import MetaMask from '../../../public/metamask.svg'
import Image from 'next/image';

const SnapOptInButton = () => {
    const defaultSnapOrigin = `local:http://localhost:8080`;
    const [optedIn, setOptedIn] = useState(false);

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
                request: { method: 'pushproto_welcome' },
            },
        });

        console.log("Res", res);

        if (res) {
            setOptedIn(true);
            //open a new tab
            window.open('https://app.push.org/channels', '_blank');
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
                <button className="flex gap-2 bg-[#E20880] hover:opacity-90 border text-[#fff] font-normal text-sm w-full py-3 px-6 rounded-lg" onClick={() => installSnap()}>
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