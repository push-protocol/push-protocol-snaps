import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, ChannelOptinRequestParams } from "../../types";
import { fetchChannels } from "../../utils";

/**
 * Handles the opt-in process for a channel.
 * @param params The parameters for channel opt-in.
 * @returns A string or boolean indicating the success of the opt-in process.
 */
export const channelOptin = async (
  params: ApiParams
): Promise<string | boolean> => {
  try {
    const { requestParams } = params;
    const requestParamsObj = requestParams as ChannelOptinRequestParams;

    // Fetch channel details
    const res = await fetchChannels(requestParamsObj.channelAddress);
    const channelName = res.channelName;
    const unsubscribedAccounts = res.unsubscribedAccounts;

    // Check if user is already subscribed to the channel
    if (unsubscribedAccounts.length == 0) {
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Channel Opt-In"),
            divider(),
            text("You are already subscribed to this channel"),
          ]),
        },
      });
      return false;
    } else {
      // Prompt the user for channel subscription confirmation
      const response = await snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            heading("Channel Opt-In"),
            divider(),
            text(`Do you want to subscribe to ${channelName} ?`),
          ]),
        },
      });
      return response;
    }
  } catch (error) {
    // Handle or log the error as needed
    console.error("Error in channelOptin:", error);
    // Optionally rethrow the error if you want it to propagate further
    throw error;
  }
};
