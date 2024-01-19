
export const SnapStorageCheck = async () => {
  const defaultstate = {
    addresses: [],
    popuptoggle: 0,
    snoozeDuration: 0,
  };
  let persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get", encrypted: false },
  });
  return persistedData || defaultstate;
};

export const SnapStorageAddressCheck =async (address:string) => {
    const data = await SnapStorageCheck();
    let addresslist = data.addresses;
    if(addresslist.includes(address)){
        return true;
    }else{
        return false;
    }
}
