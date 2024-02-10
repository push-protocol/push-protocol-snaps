import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  fetchAllAddrNotifs,
  getCurrentTimestamp,
  getModifiedSnapState,
  notifyInMetamaskApp,
  updateSnapState,
} from "../../utils";

/**
 * Executes a cron job to handle notifications.
 * Fetches notifications for all subscribed addresses,
 * updates the Snap state, and displays alerts or in-app notifications as needed.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
export const notifCronJob = async (): Promise<void> => {
  try {
    // Fetch notifications for all subscribed addresses
    const notifs = await fetchAllAddrNotifs();

    console.log(notifs,"<= notifs")

    // Display an alert for new notifications
    let notif = "";
    let notifsArray = [];
    const key = Object.keys(notifs);
    for (let i = 0; i < 2; i++) {
      notifsArray = notifs[key[i]];
      notif = notif + `**${notifsArray[i].address}**`;
      for (let j = 0; j < 2; j++) {
        notif = notif + `\n\n${notifsArray[i].address}\n\n${notifsArray[i].address}\n\n`;
      }
      notif = notif + "____________________________\n\n";
    }
    console.log(notif);

//     let notif = "";
// let notifs = [];
// let each_notif_array = [];
// const key = Object.keys(obj);
// for (let i = 0; i < 2; i++) {
//   notifs = obj[key[i]];
//   notif = notif + `${notifs[i].address}`;
//   for (let j = 0; j < 2; j++) {
//     notif = notif + `\n\n${notifs[i].sender}\n\n${notifs[i].notif_body}\n\n`;
//   }
//   each_notif_array.push(notif);
//   notif = "";
// }
// console.log(each_notif_array);

    await snap.request({
            method: "snap_dialog",
            params: {
              type: "alert",
              content: panel([
                heading("notifs:"),
                text(
                  notif
                ),
              ]),
            },
          });
        
      

  

    // Display in-app notifications
    await notifyInMetamaskApp(notifs);

    const state = await getModifiedSnapState({ encrypted: false });
    const currentTimeStamp = getCurrentTimestamp();

    // Iterate over addresses in state
    for (const address in state.addresses) {
      // Check if the address is enabled
      if (state.addresses[address].enabled) {
        // Update the lastFeedsProcessedTimestamp for enabled addresses
        state.addresses[address].lastFeedsProcessedTimestamp = currentTimeStamp;
      }
    }
    await updateSnapState({
      newState: state,
      encrypted: false
    });
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in notifCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
