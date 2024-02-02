import { divider, heading, panel, text } from "@metamask/snaps-ui";

/**
 * Displays a welcome dialog to the user.
 * @returns A boolean indicating the success of displaying the dialog.
 */
export const welcomeDialog = async (): Promise<boolean> => {
  try {
    // Display the welcome dialog using snap.request
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Welcome to Push Notification Snap!"),
          divider(),
          text("🔔 Start getting notifications by opting into channels"),
        ]),
      },
    });
    return true; // Return true indicating the dialog was displayed successfully
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in welcomeDialog:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
