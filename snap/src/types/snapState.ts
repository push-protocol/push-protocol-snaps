// ToDo: specify a proper state with version for strict typescript practices
// ToDo: need to separate encrypted and non-encrypted state in future once encrypted state comes into practice.
export type SnapState = any;

export interface ISnapStateParam {
  encrypted: boolean;
}

export interface IUpdateSnapState extends ISnapStateParam {
  newState: SnapState;
}

export interface IGetSnapState extends ISnapStateParam {}

export interface IGetModifiedSnapState extends ISnapStateParam {
  state: SnapState;
}
