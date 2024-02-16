import DisableSnoozeButton from "../buttons/DisableSnoozeButton"
import SendMessageButton from "../buttons/SnoozeButton"
import { NOTIFICATION_TESTS } from "@/utils/constants"

export default function NotificationTests() {
  return (
    <div className="dark:bg-bg-secondary rounded-[20px] border-2 dark:border-white/30 w-[350px] h-auto p-6">
    <h2 className="text-xl font-semibold">
      {NOTIFICATION_TESTS.HEAD_1}
    </h2>
    <p className="text-sm pt-5 pb-2">
      {NOTIFICATION_TESTS.PARA_1}
    </p>
    <SendMessageButton/>
    <p className="text-sm pt-5 pb-2">
      {NOTIFICATION_TESTS.PARA_2}
    </p>
    <DisableSnoozeButton />
  </div>
  )
}
