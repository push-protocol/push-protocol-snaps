import { heading, panel, text } from "@metamask/snaps-ui";

export const addPGPPvtKey = async (pgpPvtKey: string) => {
const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get", encrypted: false },
});

if (pgpPvtKey) {
    if (persistedData == null) {
        const data = {
            addresses: [],
            popuptoggle: 0,
            pgpPvtKey: pgpPvtKey,
        };
        await snap.request({
            method: "snap_manageState",
            params: { operation: "update", newState: data, encrypted: false },
        });
    } else {
        const addrlist = persistedData.addresses;
        const popuptoggle = persistedData.popuptoggle;
        const pgpPvtKey = persistedData.key;

        if (pgpPvtKey) {
            return;
        } else {
            const data = {
                addresses: addrlist,
                popuptoggle: popuptoggle,
                pgpPvtKey: pgpPvtKey,
            };
            await snap.request({
                method: "snap_manageState",
                params: { operation: "update", newState: data, encrypted: false },
            });
        }
    }
} else {
    await snap.request({
    method: "snap_dialog",
    params: {
        type: "alert",
        content: panel([
        heading("Error"),
        text("PGP Private Key Not Found"),
        ]),
    },
    });
}
};