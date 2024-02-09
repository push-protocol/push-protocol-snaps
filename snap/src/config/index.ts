import { LatestSnapState } from "../types";

export const allowedSnapOrigins = [
  "https://app.push.org",
  "https://staging.push.org",
  "https://dev.push.org",
  "http://localhost:3000",
];

export const BASE_URL = 'https://backend.epns.io/apis/v1'; // Modify this as needed

export const CHAIN_ID = 1; // For prod (change this while testing in diff env)

export const defaultLatestSnapState: LatestSnapState = {
  version: 1,
  addresses: {},
  pendingInAppNotifs: []
}