import { LatestSnapState } from "../types";

export const allowedSnapOrigins = [
  "https://app.push.org",
  "https://staging.push.org",
  "https://dev.push.org",
  "http://localhost:3000", // Remove localhost port before production deployment
];

export const BASE_URL = 'https://backend.epns.io/apis/v1'; // Modify this as needed

export const CHAIN_ID = 1; // For prod (change this while testing in diff env)

export const defaultLatestSnapState: LatestSnapState = {
  version: 1,
  addresses: {},
  pendingInAppNotifs: [],
  popupsTimestamp: [],
  snoozeInfo: {
    enabledDuration: 0,
    disabledDuration: 0
  }
};

export const SNOOZE_ALERT_THRESHOLD = 1; // show snooze alert after these many popups appear in an hour
export const SNOOZE_DISABLE_DURATION = 24; // disable snooze alert for these many hrs once user rejects the alert