// ToDo: specify a proper state with version for strict typescript practices
// ToDo: need to separate encrypted and non-encrypted state in future once encrypted state comes into practice.
export type UnifiedSnapState = SnapStateV0 | SnapStateV1;

export type LatestSnapState = SnapStateV1;

// snap persisted state (non-encrypted) till v1.1.12
export type SnapStateV0 = {
  addresses: Array<string>;
  popuptoggle: number;
  snoozeDuration: number;
};

// snap persisted state (non-encrypted) from v1.1.13
export type SnapStateV1 = {
  version: 1; // Represents version of state
  addresses: { [address: string]: AddressMetadata }; // Map of addresses to their metadata
  pendingInAppNotifs: NotificationMetadata[]; // Array of pending in-app notifications (notifs that are not added in metamask inApp notifs tab)

  popupsTimestamp: Array<number> // Array of popups timestamp when they are received
  snoozeInfo: SnoozeMetadata; // Snooze info metadata
};

export type AddressMetadata = {
  // @Purpose: Represents if the address is enabled to receive notifications.
  // @Default: false
  enabled: boolean;

  // @Purpose: Represents the timestamp when the last cron job ran and processed feeds for this address.
  // @Default: timestamp when address was added in snap
  lastFeedsProcessedTimestamp: number;

  // Add any other metadata fields you may need in the future
};

export type NotificationMetadata = {
  address: string; // Unique identifier for the notification
  message: string; // Message content of the notification
  timestamp: number; // Timestamp when the notification was created
  // Add more properties as needed
};

export type SnoozeMetadata = {
  // @Purpose: Represents the timestamp till when pop-ups are snoozed
  // @Default: 0
  enabledDuration: number; 

  // @Purpose: Represents the timestamp till when snooze functionality is disabled 
  // @Default: 0
  disabledDuration: number;
};

export interface ISnapStateParam {
  encrypted: boolean;
}

export interface IUpdateSnapState extends ISnapStateParam {
  newState: LatestSnapState;
}

export type IGetSnapState = ISnapStateParam;

export type IGetModifiedSnapState = ISnapStateParam;
