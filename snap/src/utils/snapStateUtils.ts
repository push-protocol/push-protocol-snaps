import {
  IGetModifiedSnapState,
  IGetSnapState,
  IUpdateSnapState,
  SnapState,
} from "../types";

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
