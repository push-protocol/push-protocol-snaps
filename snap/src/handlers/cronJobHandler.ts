import { OnCronjobHandler } from "@metamask/snaps-types";
import { notifCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";

/**
 * Handles cronjobs for the Snap, executing the appropriate method based on the request.
 * @param {object} options - The options for handling the cronjob.
 * @param {object} options.request - The request object containing information about the cronjob.
 * @param {string} options.request.method - The method to execute for the cronjob.
 * @throws {Error} Throws an error if the specified method is not found.
 */
export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method as SnapCronJobMethod) {
    case SnapCronJobMethod.NotifCronJob:
      await notifCronJob();
      break;
    // case SnapCronJobMethod.CheckActivityCronJob:
    //   await checkActivityCronJob();
    //   break;
    // case SnapCronJobMethod.RemoveSnoozeCronJob:
    //   await removeSnoozeCronJob();
    //   break;
    default:
      throw new Error("Method not found.");
  }
};
