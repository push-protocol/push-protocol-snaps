import { LatestSnapState } from "../types";

export const sleep = (timeoutSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, timeoutSeconds));

// All getter functions of state here, so when version of state is changed, we only need to update these getters

/**
 * Retrieves an array of addresses that are marked as enabled in the SnapStateV1.
 * @param state - The SnapStateV1 object.
 * @returns An array of addresses that have the 'enabled' property set to true in the metadata.
 */
export const getEnabledAddresses = (state: LatestSnapState): string[] => {
  /**
   * Array to store addresses that are marked as enabled.
   * @type {string[]}
   */
  const enabledAddresses: string[] = [];

  /**
   * Iterate through the addresses in the SnapStateV1 and check if each one is marked as enabled.
   */
  for (const [address, metadata] of Object.entries(state.addresses)) {
    /**
     * Check if the 'enabled' property is true in the metadata.
     */
    if (metadata.enabled) {
      /**
       * If the address is marked as enabled, add it to the array.
       */
      enabledAddresses.push(address);
    }
  }

  /**
   * Return the array of enabled addresses.
   */
  return enabledAddresses;
};

/**
 * Checks if a specific address is marked as enabled in the SnapStateV1.
 * @param state - The SnapStateV1 object.
 * @param address - The address to check.
 * @returns True if the address is marked as enabled, otherwise false.
 */
export const isAddressEnabled = (state: LatestSnapState, address: string): boolean => {
  /**
   * Retrieve the metadata for the specified address.
   */
  const metadata = state.addresses[address];

  /**
   * Check if the metadata exists and the 'enabled' property is true.
   */
  return !!metadata && metadata.enabled;
};
