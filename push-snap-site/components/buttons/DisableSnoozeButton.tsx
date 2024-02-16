export default function DisableSnoozeButton() {
  const defaultSnapOrigin = `local:http://localhost:8080`;

  const disableSnooze = async () => {
    console.log(
      await window.ethereum?.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: "pushproto_disablesnooze",
          },
        },
      })
    );
  };

  return (
    <button
      onClick={disableSnooze}
      className="flex bg-white text-black font-bold text-sm p-2 rounded-lg border-2 border-text-secondary ring-1 ring-white"
    >
      Disable Snooze
    </button>
  );
}
