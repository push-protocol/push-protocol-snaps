import { OnRpcRequestHandler,OnCronjobHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { ethers } from 'ethers';

async function getAccount(){
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
}

async function initiateAccountList(address:String){
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: { accounts: [address] } },
  });
}

async function getAccountList(){
  const data = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
  return data;
}

async function addAccountToList(address:String){
  let accountList = await getAccountList();
  if(accountList.accounts !== undefined || accountList.accounts !== null || accountList.accounts.length !== 0){
    if(!accountList.accounts.includes(address)){
      accountList.accounts.push(address);
      await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: { accounts: accountList.accounts } },
      });
    }
  }
}

async function getNotifications(address:string){
  const url = `https://backend-staging.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

async function filterNotifications(address:string){
  let fetchedNotifications = await getNotifications(address);
  fetchedNotifications = fetchedNotifications?.feeds;
  let msg = `${
    fetchedNotifications[0].payload.data.app
  }-${
    fetchedNotifications[0].payload.data.amsg
  }`;

  if(msg.length > 50){
    msg = msg.slice(0, 47) + '...';
  }

  return msg;
}

export const onRpcRequest: OnRpcRequestHandler = async({ origin, request }) => {
  switch (request.method) {
    case 'hello':{
      const address = await getAccount();
      addAccountToList(address);
      // const msg = await filterNotifications(address);
      const accountList = await getAccountList();
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: `${address.slice(0,5)} : ${accountList.accounts.length}`,
        },
      });}
    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'fireCronjob':
      const address = await getAccount();
      const msg = await filterNotifications(address);
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: msg,
        },
      });

    default:
      throw new Error('Method not found.');
  }
};
