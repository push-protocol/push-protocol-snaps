import {
  IGetModifiedSnapState,
  IGetSnapState,
  IUpdateSnapState,
  SnapState,
} from "../types";

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
        encrypted,
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
export const getSnapState = async (getParams: IGetSnapState): Promise<SnapState> => {
  try {
    const { encrypted } = getParams;
    return await snap.request({
      method: "snap_manageState",
      params: {
        operation: "get",
        encrypted
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves a modified state of the Snap.
 * @param params The parameters for retrieving the modified Snap state.
 * @returns The modified state of the Snap.
 * @throws Error if there is an issue retrieving the modified state.
 */
export const getModifiedSnapState = async (
  params: IGetModifiedSnapState
): Promise<SnapState> => {
  try {
    const { state, encrypted } = params;

    // ToDo: modify existing state to latest version snap state
    const newState: SnapState = {};
    return newState;
  } catch (err) {
    throw new Error(err);
  }
};
