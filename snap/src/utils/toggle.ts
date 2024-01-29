import { updateSnapState } from "./snapStateUtils";
import { SnapStorageCheck } from "./snapstoragecheck";

export const popupToggle = async (notifcount: number) => {
  let persistedData = await SnapStorageCheck();

  let popuptoggle = notifcount;

  const data = {
    addresses: persistedData.addresses,
    popuptoggle: popuptoggle,
  };
  await updateSnapState({
    newState: data,
    encrypted: false,
  });
};

export const popupHelper = (notifs: String[]) => {
  console.log("notif: ", notifs);
  let msg = [] as String[];
  if (notifs.length > 0) {
    notifs.forEach((notif) => {
      let str = `\n🔔` + notif + "\n";
      msg.push(str);
    });
  }
  console.log("msg: ", msg);
  return msg;
};
