import { heading, panel, text } from "@metamask/snaps-ui";

export const popupHelper = (notifs: String[]) => {
  if (notifs.length > 0) {
    let msg = [];
    notifs.forEach((notif) => {
      let str = `\n🔔` + notif + "\n";
      msg.push(str);
    });
    return msg;
  }
};
