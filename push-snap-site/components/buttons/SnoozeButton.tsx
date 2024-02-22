import React, { useState } from 'react';

export default function SnoozeButton() {
  const defaultSnapOrigin = `local:http://localhost:8080`;
  const [snoozeDuration, setSnoozeDuration] = useState('');

  const Snooze = async () => {
    // Check if snoozeDuration is within the range of 1 to 72
    const duration = parseInt(snoozeDuration);
    if (duration >= 1 && duration <= 72) {
      console.log(await window.ethereum?.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: defaultSnapOrigin,
          request: { 
            method: 'pushproto_setsnoozeduration',
            params: { snoozeDuration: snoozeDuration }
          },
        },
      }));
    } else {
      // Display an error message if the input is invalid
      console.error('Invalid input. Please enter a number between 1 and 72.');
    }
  };

  return (
    <div className='flex'>
      <input
        type="number"
        min="1"
        max="72"
        value={snoozeDuration}
        onChange={(e) => setSnoozeDuration(e.target.value)}
        className="mr-2 p-2 border border-gray-300 rounded-lg grow"
        placeholder="Enter duration (1-72)"
      />
      <button
        onClick={Snooze}
        className="flex bg-white text-black font-bold text-sm p-2 rounded-lg border-2 border-text-secondary ring-1 ring-white"
      >
        Snooze
      </button>
    </div>
  );
}
