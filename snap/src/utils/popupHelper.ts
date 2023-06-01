import { heading, panel, text } from "@metamask/snaps-ui";

export const popupHelper = (notifs: String[]) => {
  let msg = [];
  if (notifs.length > 0) {
    notifs.forEach((notif) => {
      let str = `\n🔔` + notif + "\n";
      msg.push(str);
    });
  }
  return msg;
};
