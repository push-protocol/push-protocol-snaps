import GetChatButton from "../buttons/GetChatButton"
import { CHAT_TESTS } from "@/utils/constants"

export default function ChatTests() {
  return (
    <div className="dark:bg-bg-secondary rounded-[20px] border-2 dark:border-white/30 w-[275px] h-[226px] p-6">
    <h2 className="text-xl font-semibold">
      {CHAT_TESTS.HEAD_1}
    </h2>
    <p className="text-sm pt-5 pb-7">
      {CHAT_TESTS.PARA_1}
    </p>
    <GetChatButton/>
  </div>
  )
}

