// import { heading, panel, text } from "@metamask/snaps-ui";
// import { SnapStorageCheck } from "../../utils";

/**
 * Checks if the snooze duration flag is greater than or equal to 41.
 * If true, turns off notification snooze and displays an alert.
 * @returns {Promise<void>} - Resolves once the cron job is completed.
 */
// export const removeSnoozeCronJob = async (): Promise<void> => {
//   // Retrieve Snap state to check the snooze flag
//   const persistedData = await SnapStorageCheck();
//   const snoozeFlag = persistedData.popuptoggle;

//   // Check if the snooze flag is greater than or equal to 41
//   if (Number(snoozeFlag) >= 41) {
//     // Update Snap state to turn off notification snooze
//     const data = {
//       addresses: persistedData.addresses,
//       popuptoggle: 0,
//     };

//     await snap.request({
//       method: "snap_manageState",
//       params: { operation: "update", newState: data },
//     });

//     // Display an alert to notify the user that snooze has been turned off
//     await snap.request({
//       method: "snap_dialog",
//       params: {
//         type: "alert",
//         content: panel([
//           heading("Snooze Alert"),
//           text(
//             "Notification snooze has been turned off, you will start getting popup notifications from now on."
//           ),
//         ]),
//       },
//     });
//   }
// };
