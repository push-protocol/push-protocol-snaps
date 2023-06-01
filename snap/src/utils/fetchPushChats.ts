export const fetchPushChats = async () => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });

  const address = persistedData.addresses[0];

  let chatdetails = await fetch(`https://backend-staging.epns.io/apis/v1/chat/users/eip155:${address}/chats?page=1&limit=10`);
  chatdetails = await chatdetails.json();
  chatdetails = chatdetails.chats[0]; 

  let threadhash = chatdetails.threadhash;

  let res = await fetch(
    `https://backend-staging.epns.io/apis/v1/ipfs/${threadhash}`
  );
  let latestChat = await res.json();

  let chat = "";

  if (latestChat) {
    let currtime = Math.floor(Date.now() / 1000);
    let latestChatTime = latestChat.timestamp;
    let chattimeepoch = latestChatTime / 1000;
    let diff = currtime - chattimeepoch;

    let sender = latestChat.fromDID;
    sender = sender.split(":")[1];

    if (diff < 60) {
      if (String(sender).toLowerCase() != String(address).toLowerCase()) {
        chat = `💬 New message from ${sender.slice(0,7)}`;
      }
    }
  }
  return chat;
};
