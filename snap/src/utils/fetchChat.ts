import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import * as openpgp from "openpgp";
const { ethers } = require("ethers");
import axios from "axios";

export const fetchChats = async (key: any) => {
  const pvtkey =
    "5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82";
  const signer = new ethers.Wallet(pvtkey);

  console.log(signer.address);

  let user = await axios.get(
    `https://backend-staging.epns.io/apis/v2/users/?caip10=eip155:0x28a292f4dC182492F7E23CFda4354bff688f6ea8`
  );

  // Get the public key of the user to verify their identity

  let chats = await axios.get(
    `https://backend-staging.epns.io/apis/v1/chat/users/eip155:0x118aeFa610ceb7C42C73d83dfC3D8C54124A4946/chats/`
  );

  const encryptedPgpPvtKey = user.data.encryptedPrivateKey;

  const decryptedPgpPvtKey = key;

  let chatString = "";

  if (chats) {
    chatString = JSON.stringify(chats[0]);

    const chat = JSON.parse(chatString);

    const message = await openpgp.readMessage({
      armoredMessage: chat.msg.encryptedSecret,
    });

    const privateKey = await openpgp.readPrivateKey({
      armoredKey: decryptedPgpPvtKey,
    });

    //     const { data: decrypted } = await openpgp.decrypt({
    //       message: message,
    //       `decrypt`ionKeys: privateKey,
    //     });
    //     return chat;
    //   }
    return { decryptedPgpPvtKey };
  }
};
