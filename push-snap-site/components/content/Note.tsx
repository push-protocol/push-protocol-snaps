import SendMessageButton from "../buttons/SnoozeButton"
import { NOTE } from "@/utils/constants"

export default function Note() {
  return (
    <div className="dark:bg-bg-secondary text-sm rounded-[20px] border-2 dark:border-white/30 w-[275px] h-[226px] p-6">
      {NOTE.PARA_1}
      <span className="font-semibold">{NOTE.PARA_2}</span>
      {NOTE.PARA_3}
      <span className="font-semibold">{NOTE.PARA_4}</span>
      {NOTE.PARA_5}
    </div>
  )
}