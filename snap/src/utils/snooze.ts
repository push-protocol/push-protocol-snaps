import { updateSnapState } from "./snapStateUtils";
import { SnapStorageCheck } from "./snapstoragecheck";

/**
 * Sets the snooze duration for notifications.
 * @param snoozeDur The snooze duration in hours.
 */
export const setSnoozeDuration = async (snoozeDur: number) => {
    let snoozeInHours = snoozeDur;
    // Retrieve current Snap storage data
    let persistedData = await SnapStorageCheck();

    // Get the local time in epoch
    let currentTimeEpoch = new Date().getTime();

    // Prepare updated data with the new snooze duration
    const data = {
        addresses: persistedData.addresses,
        popuptoggle: persistedData.popuptoggle,
        // Store the timestamp until which snooze will be enabled
        snoozeDuration: currentTimeEpoch + snoozeInHours * 60 * 60 * 1000,
    };

    // Update Snap state with the new data
    await updateSnapState({
        newState: data,
        encrypted: false
    });
}
