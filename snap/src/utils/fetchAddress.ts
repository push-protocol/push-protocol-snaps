import { divider, heading, panel, text } from "@metamask/snaps-ui";

const {ethers} = require('ethers');

export const addAddress = async (address:string) => {

    const persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });

    if(persistedData == null){
        const data = {
            addresses: [address],
        };
        await snap.request({
            method: 'snap_manageState',
            params: { operation: 'update', newState:data },
        });
    }else{
        const addrlist = persistedData.addresses;
        if(addrlist!.includes(address)){
            return;
        }else{
            addrlist!.push(address);
            const data = {
                addresses: addrlist,
            };
            await snap.request({
                method: 'snap_manageState',
                params: { operation: 'update', newState:data },
            });
        }
    }
};

export const confirmAddress = async () => {
    const persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });
    const data = persistedData.addresses;
    let msg='';
    for(let i = 0; i < data!.length; i++){
        msg = msg + '🔹' + data![i] + '\n';
    }
    return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Address added'),
            text('Following addresses will receive notifications:'),
            divider(),
            text(`${msg}`)
          ]),
        },
      });

};

export const clearAddress = async () => {
    const data = {
        addresses: [],
    };
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data },
    });
}

export const removeAddress = async (address:string) => {
    const persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });
    const data = persistedData!.addresses;
    if(data!.includes(address)){
        const index = data!.indexOf(address);
        data!.splice(index,1);
        const newdata = {
            addresses: data,
        };
        await snap.request({
            method: 'snap_manageState',
            params: { operation: 'update', newState:newdata },
        });
    }
}

export const fetchAddress = async () => {
    const persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });
    const addresses = persistedData!.addresses;
    return addresses;
};