import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { ApiParams, ChannelOptinRequestParams } from "../../types";
import { fetchChannels } from "../../utils";

export const channelOptin = async (
  params: ApiParams
): Promise<string | boolean> => {
  const { requestParams } = params;
  const requestParamsObj = requestParams as ChannelOptinRequestParams;

  const res = await fetchChannels(requestParamsObj.channelAddress);
  const channelName = res.channelName;
  const unsubscribedAccounts = res.unsubscribedAccounts;
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
    const res = await snap.request({
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
    return res;
  }
};
