export const popupToggle= async (time:string) => {
    let persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });

    let popuptoggle = time;

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
    };
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data },
    });
};