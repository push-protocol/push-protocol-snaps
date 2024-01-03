import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import * as openpgp from "openpgp";
const { ethers } = require("ethers");

export const fetchChats = async () => {
  const pvtkey =
    "5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82";
  const signer = new ethers.Wallet(pvtkey);

  console.log(signer.address);

  const user = await PushAPI.user.get({
    account: signer.address,
  });

  const encryptedPgpPvtKey = user.encryptedPrivateKey;

  const decryptPGPKey = await PushAPI.chat.decryptPGPKey({
    account: signer.address,
    encryptedPGPPrivateKey: encryptedPgpPvtKey,
    signer: signer,
  });

  console.log(decryptPGPKey);

  const chats = await PushAPI.chat.chats({
    account: signer.address,
    env: ENV.STAGING,
  });

  let chatString = "";
  console.log(chats, "chats here");

  if (chats.length > 0) {
    chatString = JSON.stringify(chats[0]);

    console.log(chatString);

    const chat = JSON.parse(chatString);
    console.log(chat, "chats here:");

    const message = await openpgp.readMessage({
      armoredMessage: chat.msg.encryptedSecret,
    });

    const privateKey = await openpgp.readPrivateKey({
      armoredKey: decryptPGPKey,
    });

    const { data: decrypted } = await openpgp.decrypt({
      message: message,
      decryptionKeys: privateKey,
    });
    return chat;
  }
};
