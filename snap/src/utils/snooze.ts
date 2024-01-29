import { updateSnapState } from "./snapStateUtils";
import { SnapStorageCheck } from "./snapstoragecheck";

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

    await updateSnapState({
        newState: data,
        encrypted: false
    });
}