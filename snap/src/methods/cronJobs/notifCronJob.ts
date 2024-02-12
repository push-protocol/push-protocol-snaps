import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  fetchAllAddrNotifs,
  getCurrentTimestamp,
  getModifiedSnapState,
  groupNotifications,
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
    const notif = await fetchAllAddrNotifs();

    const notifs = await groupNotifications(notif);

    console.log(notifs, "<= notifs");

    // Display an alert for new notifications
    // let notif = "";
    // let notifsArray = [];
    // const key = Object.keys(notifs);
    // for (let i = 0; i < key.length; i++) {
    //   notifsArray = notifs[key[i]];
    //   notif = notif + `**${notifsArray[i].address}**`;
    //   const date = new Date(notifsArray[i].timestamp).toLocaleString("en-US", {
    //     hour: "numeric",
    //     minute: "numeric",
    //     hour12: true,
    //   }); // Format the timestamp
    //   for (let j = 0; j < notifsArray.length; j++) {
    //     notif =
    //       notif +
    //       `\n\n${notifsArray[i].notification.title}\n\n${notifsArray[i].notification.body}\n\n ${date} \n\n`;
    //   }
    //   notif = notif + "____________________________\n\n";
    // }
    // console.log(notif);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    if (Object.keys(notifs).length) {
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("You have a notification!"),
            divider(),
            ...Object.keys(notifs).map((notif) => {
              // notif is a key
              return panel([
                ...notifs[notif].map((n) => {
                  const date = new Date(n.timestamp);
                  const formattedDate = `${date.toLocaleDateString(
                    "en-US",
                    options
                  )} at ${
                    date
                      .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(/:\d+ /, " ")
                      .replace("AM", "am")
                      .replace("PM", "pm")
                      .split(" ")[0]
                  }`;
                  return panel([
                    text(`**${n.address}**`),
                    text(`**${n.popupMsg}**`),
                    text(n.notification.body),
                    text(`-` + `${formattedDate}`),
                  ]);
                }),
                divider(),
              ]);
            }),
          ]),
        },
      });
    }

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
      encrypted: false,
    });
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in notifCronJob:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
