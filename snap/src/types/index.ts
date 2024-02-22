export * from "./snapApi";
export * from "./snapState";

/**
 * Represents a notification object format.
 */
export interface INotification {
  address: string; // Address associated with the notification
  channelName: string; // Name of the channel
  epoch: number;
  notification: {
    body: string; // Body content of the notification
    title: string; // Title of the notification
  };
  msgData: {
    popupMsg: string; // Message for displaying in a popup
    inAppNotifMsg: string; // Message for displaying in an in-app notification of metamask}
    timestamp: string; // Timestamp when the notification was received
    cta: string; // CTA url that notification direct to
  };
}

export interface INotificationGroup {
  [address: string]: INotification[];
}
