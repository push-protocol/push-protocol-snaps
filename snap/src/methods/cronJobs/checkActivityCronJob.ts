import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck, fetchAllAddrNotifs } from "../../utils";

export const checkActivityCronJob = async (): Promise<void> => {
  const notifs = await fetchAllAddrNotifs();
  let persistedData = await SnapStorageCheck();
  const addresses: string[] = persistedData.addresses;
  if (notifs.length == 0 || addresses.length == 0) {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Activity Alert"),
          divider(),
          text(
            `Looks like it's been quiet since your last visit! Check out https://app.push.org/channels and opt-in to receive notifications.`
          ),
        ]),
      },
    });
  }
};
