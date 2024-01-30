import { getSnapState } from "./snapStateUtils";

/**
 * Checks Snap storage for persisted data.
 * @returns Persisted Snap state or default state if no data is found.
 */
export const SnapStorageCheck = async () => {
  const defaultstate = {
    addresses: [],
    popuptoggle: 0,
    snoozeDuration: 0,
  };
  // Retrieve Snap state from storage
  let persistedData = await getSnapState({
    encrypted: false,
  });
  // Return persisted state or default state if no data is found
  return persistedData || defaultstate;
};

/**
 * Checks if a specific address is stored in Snap storage.
 * @param address The address to check.
 * @returns True if the address is found in Snap storage, false otherwise.
 */
export const SnapStorageAddressCheck = async (address: string) => {
  // Retrieve Snap storage data
  const data = await SnapStorageCheck();
  let addresslist = data.addresses;
  // Check if the address is in the list of stored addresses
  if (addresslist.includes(address)) {
    return true;
  } else {
    return false;
  }
};
