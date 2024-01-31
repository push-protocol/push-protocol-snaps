// import { divider, heading, panel, text } from "@metamask/snaps-ui";
// import { SnapStorageCheck, setSnoozeDuration, snoozeNotifs } from "../../utils";

// /**
//  * Initiates the process for setting the snooze duration for notifications.
//  * This function checks Snap storage, prompts the user for confirmation, 
//  * and sets the snooze duration if the user approves.
//  */
// export const snoozeDuration = async (): Promise<void> => {
//   // Check Snap storage
//   await SnapStorageCheck();

//   // Prompt the user for confirmation to snooze notifications
//   const result = await snap.request({
//     method: "snap_dialog",
//     params: {
//       type: "confirmation",
//       content: panel([
//         heading("Snooze Notifications"),
//         divider(),
//         text(
//           "Too many notifications to keep up with? You can temporarily snooze them to take a break. Approving will enable notification snooze."
//         ),
//       ]),
//     },
//   });

//   // If user approves, snooze notifications and set the snooze duration
//   if (result) {
//     // Snooze notifications
//     const snoozeDuration = await snoozeNotifs();
//     // Set snooze duration
//     setSnoozeDuration(Number(snoozeDuration));
//   }
// };
