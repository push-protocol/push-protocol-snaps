
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
