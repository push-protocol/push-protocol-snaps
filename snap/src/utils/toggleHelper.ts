import { SnapStorageCheck } from "../helper/snapstoragecheck";

export const popupToggle= async (notifcount:number) => {
    let persistedData = await SnapStorageCheck();

    let popuptoggle = notifcount;

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
    };
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data, encrypted: false },
    });
};

export const setSnoozeDuration = async (snoozeDur: number) => {
    let snoozeInHours = snoozeDur;
    let persistedData = await SnapStorageCheck();

    // get the local time in epoch
    let currentTimeEpoch = new Date().getTime();

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: persistedData.popuptoggle,
        // store the timestamp till which snooze will be enabled
        snoozeDuration: currentTimeEpoch + snoozeInHours * 60 * 60 * 1000,
    };

    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: data, encrypted: false },
    });
}
