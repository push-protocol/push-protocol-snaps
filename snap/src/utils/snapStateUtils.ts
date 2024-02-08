import { defaultLatestSnapState } from "../config";
import {
  AddressMetadata,
  IGetModifiedSnapState,
  IGetSnapState,
  IUpdateSnapState,
  LatestSnapState,
  SnapStateV0,
  UnifiedSnapState,
} from "../types";
import { getCurrentTimestamp } from "./time";

/**
 * Updates the state of the Snap.
 * @param updateParams The parameters for updating the Snap state.
 * @throws Error if there is an issue updating the state.
 */
export const updateSnapState = async (updateParams: IUpdateSnapState) => {
  try {
    const { newState, encrypted } = updateParams;
    await snap.request({
      method: "snap_manageState",
      params: {
        operation: "update",
        newState,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        encrypted, // Ignore TypeScript error for this line till we get typings from metamask sdk
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves the state of the Snap.
 * @param getParams The parameters for retrieving the Snap state.
 * @returns The current state of the Snap.
 * @throws Error if there is an issue retrieving the state.
 */
export const getSnapState = async (
  getParams: IGetSnapState
): Promise<UnifiedSnapState> => {
  try {
    const { encrypted } = getParams;
    return (await snap.request({
      method: "snap_manageState",
      params: {
        operation: "get",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        encrypted, // Ignore TypeScript error for this line till we get typings from metamask sdk 
      },
    })) as UnifiedSnapState;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Updates the stored snap state version if required and updates it
 * @param params The parameters for retrieving the modified Snap state.
 * @returns The modified state of the Snap.
 * @throws Error if there is an issue retrieving the modified state.
 */
export const getModifiedSnapState = async (
  params: IGetModifiedSnapState
): Promise<LatestSnapState> => {
  try {
    const { encrypted } = params;

    let state = await getSnapState({ encrypted });

    // Initialize the state if empty
    if (!state) {
      state = defaultLatestSnapState; // ToDo: Use default snap state here from config
      // Initialize state if empty and set default data
      await updateSnapState({
        newState: state,
        encrypted,
      });
    } else {
      // ToDo: Update the snap state to the latest version and modify it - to use getModifiedSnapState
      // await updateSnapState(state);
      if ("version" in state) {
        if (state.version === defaultLatestSnapState.version) {
          // State is already in the latest version, no need to modify
        } else {
          // Modify to the latest version
          // Note: This section may be needed when introducing a new version in the future
        }
      } else {
        // if version doesn't exist in state, then it's surely state v0
        // Modify to the latest version from v0
        state = modifyS0ToLatest(state);

        await updateSnapState({
          newState: state,
          encrypted,
        });
      }
    }
    return {...defaultLatestSnapState ,...state};
  } catch (err) {
    console.error("Error in getModifiedSnapState:", err);
    throw err;
  }
};

/**
 * Modifies a SnapStateV0 to the latest version.
 * @param state The SnapStateV0 to be modified.
 * @returns The modified SnapStateV0.
 */
export const modifyS0ToLatest = (state: SnapStateV0): LatestSnapState => {
  const newAddresses: { [address: string]: AddressMetadata } = {};

  state.addresses.forEach((address) => {
    newAddresses[address] = {
      enabled: true,
      lastFeedsProcessedTimestamp: getCurrentTimestamp()
    };
  });

  const newState: LatestSnapState = {
    ...defaultLatestSnapState,
    addresses: newAddresses,
  };

  return newState;
};
