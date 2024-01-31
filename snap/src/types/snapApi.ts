import { LatestSnapState } from "./snapState";

export type ApiRequestParams =
  | AddAddressRequestParams
  | RemoveAddressRequestParams
  | TogglePopupRequestParams;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseRequestParams {}

export interface AddAddressRequestParams extends BaseRequestParams {
  address: string;
}

export interface RemoveAddressRequestParams extends BaseRequestParams {
  address: string;
}

export type TogglePopupRequestParams = BaseRequestParams

export interface ChannelOptinRequestParams extends BaseRequestParams {
  channelAddress: string;
}

export type ApiParams = {
    state: LatestSnapState;
    requestParams: ApiRequestParams;
}

export enum SnapRpcMethod {
  AddAddress = "pushproto_addaddress",
  RemoveAddress = "pushproto_removeaddress",
  Welcome = "pushproto_welcome",
  TogglePopup = "pushproto_togglepopup",
  SnoozeDuration = "pushproto_snoozeduration",
  OptIn = "pushproto_optin",
  OptInComplete = "pushproto_optincomplete",
  GetAddresses = "pushproto_getaddresses",
  GetToggleStatus = "pushproto_gettogglestatus",
  FirstChannelOptIn = "pushproto_firstchanneloptin",
}

export enum SnapCronJobMethod {
  NotifCronJob = "notifCronJob",
  CheckActivityCronJob = "checkActivityCronJob",
  RemoveSnoozeCronJob = "removeSnoozeCronJob",
}
