export * from "./snapApi";
export * from "./snapState";

/**
 * Represents a notification object format.
 */
export interface INotification {
  address: string; // Address associated with the notification
  channelName: string; // Name of the channel
  timestamp: number; // Timestamp when the notification was received
  notification: {
    body: string; // Body content of the notification
    title: string; // Title of the notification
  };
  popupMsg: string; // Message for displaying in a popup
  inAppNotifMsg: string; // Message for displaying in an in-app notification of metamask
}
