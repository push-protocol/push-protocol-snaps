import { OnCronjobHandler } from "@metamask/snaps-types";
import { notifCronJob } from "../methods";
import { SnapCronJobMethod } from "../types";

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
