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
        params: { operation: 'update', newState:data },
    });
};

export const setSnoozeDuration = async (snoozeDur: number) => {
    let snoozeInMins = snoozeDur;
    let persistedData = await SnapStorageCheck();

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: persistedData.popuptoggle,
        snoozeDuration: snoozeInMins,
    };

    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data },
    });
}
