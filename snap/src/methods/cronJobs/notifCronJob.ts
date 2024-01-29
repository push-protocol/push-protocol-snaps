import { divider, heading, panel, text } from "@metamask/snaps-ui";
import {
  SnapStorageCheck,
  fetchAllAddrNotifs,
  popupHelper,
  sleep,
  updateSnapState,
} from "../../utils";

export const notifCronJob = async (): Promise<void> => {
  const notifs = await fetchAllAddrNotifs();
  let msgs = popupHelper(notifs);

  let persistedData = await SnapStorageCheck();

  let popuptoggle = msgs.length;
  if (persistedData != null) {
    popuptoggle += Number(persistedData.popuptoggle);
  }

  const data = {
    addresses: persistedData.addresses,
    popuptoggle: popuptoggle,
    snoozeDuration: persistedData.snoozeDuration || 0,
  };

  // let currentTimeEpoch = new Date().getTime();

  await updateSnapState({
    newState: data,
    encrypted: false,
  });
  persistedData = data;

  // if user is recieving more than 25 notifications, then remind them to turn on snooze
  // if (Number(popuptoggle) <= 15 && currentTimeEpoch > Number(persistedData.snoozeDuration)) {
  if (msgs.length > 0) {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("You have a new notification!"),
          divider(),
          ...msgs.map((msg) => text(msg)),
        ]),
      },
    });
  }
  // } else if (Number(popuptoggle) == 16 && currentTimeEpoch >= Number(persistedData.snoozeDuration)) {
  //   await SnapStorageCheck();

  //   const result = await snap.request({
  //     method: 'snap_dialog',
  //     params: {
  //       type: 'confirmation',
  //       content: panel([
  //         heading('Snooze Notifications'),
  //         divider(),
  //         text('Too many notifications to keep up with? You can temporarily snooze them to take a break. Approving will enable notification snooze.'),
  //       ]),
  //     },
  //   });

  //   if (result) {
  //     const snoozeDuration = await snoozeNotifs();
  //     setSnoozeDuration(Number(snoozeDuration));
  //   }
  //   break;
  // }

  if (msgs.length > 0) {
    let maxlength = msgs.length > 11 ? 11 : msgs.length;
    for (let i = 0; i < maxlength; i++) {
      let msg = msgs[i];
      msg = String(msg);
      msg = msg.slice(0, 47);
      await snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: msg,
        },
      });
      await sleep(5000);
    }
  }
};
