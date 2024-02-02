// import { heading, panel, text } from "@metamask/snaps-ui";
// import { ApiParams, TogglePopupRequestParams } from "../../types";
// import { popupToggle, SnapStorageCheck } from "../../utils";

// /**
//  * Toggles the display of notification pop-ups from Push Snap.
//  * @param params The parameters for toggling the pop-up display.
//  */
// export const togglePopup = async (params: ApiParams): Promise<void> => {
//   const { requestParams } = params;
//   const requestParamsObj = requestParams as TogglePopupRequestParams;

//   // Check Snap storage for the current pop-up toggle state
//   const persistedData = await SnapStorageCheck();
//   const popuptoggle = persistedData.popuptoggle;

//   // Toggle the pop-up display based on the current state
//   if (Number(popuptoggle) <= 25) {
//     // If pop-ups are currently enabled, disable them
//     popupToggle(27);

//     // Display an alert to inform the user that pop-ups are disabled
//     await snap.request({
//       method: "snap_dialog",
//       params: {
//         type: "alert",
//         content: panel([
//           heading("Snooze Pop-ups On"),
//           text("Disable Notification Pop-ups from Push Snap"),
//         ]),
//       },
//     });
//   } else {
//     // If pop-ups are currently disabled, enable them
//     popupToggle(0);

//     // Display an alert to inform the user that pop-ups are enabled
//     await snap.request({
//       method: "snap_dialog",
//       params: {
//         type: "alert",
//         content: panel([
//           heading("Snooze Pop-ups Off"),
//           text("Enable Notification Pop-ups from Push Snap"),
//         ]),
//       },
//     });
//   }
// };
