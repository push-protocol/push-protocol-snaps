import { updateSnapState } from "./snapStateUtils";
import { SnapStorageCheck } from "./snapstoragecheck";

/**
 * Toggles the popup based on the number of notifications.
 * @param notifcount The number of notifications.
 */
export const popupToggle = async (notifcount: number) => {
  // Retrieve current Snap storage data
  let persistedData = await SnapStorageCheck();

  // Update the popuptoggle value
  let popuptoggle = notifcount;

  // Prepare updated data with the new popuptoggle value
  const data = {
    addresses: persistedData.addresses,
    popuptoggle: popuptoggle,
  };

  // Update Snap state with the new data
  await updateSnapState({
    newState: data,
    encrypted: false,
  });
};

/**
 * Formats notifications for display in the popup.
 * @param notifs An array of notifications.
 * @returns An array of formatted notification messages.
 */
export const popupHelper = (notifs: String[]) => {
  console.log("notif: ", notifs);
  let msg = [] as String[];

  // Format each notification for display
  if (notifs.length > 0) {
    notifs.forEach((notif) => {
      let str = `\n🔔` + notif + "\n";
      msg.push(str);
    });
  }

  console.log("msg: ", msg);
  return msg;
};
