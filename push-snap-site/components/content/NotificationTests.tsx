import SendMessageButton from "../buttons/SendMessageButton"
import { NOTIFICATION_TESTS } from "@/utils/constants"

export default function NotificationTests() {
  return (
    <div className="dark:bg-bg-secondary rounded-[20px] border-2 dark:border-white/30 w-[275px] h-[226px] p-6">
    <h2 className="text-xl font-semibold">
      {NOTIFICATION_TESTS.HEAD_1}
    </h2>
    <p className="text-sm pt-5 pb-7">
      {NOTIFICATION_TESTS.PARA_1}
    </p>
    <SendMessageButton/>
  </div>
  )
}

