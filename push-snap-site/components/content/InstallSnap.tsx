import ReconnectButton from "../buttons/ReconnectButton"
import { INSTALL_SNAP } from "@/utils/constants"

export default function InstallSnap() {
  return (
    <div className="dark:bg-bg-secondary rounded-[20px] border-2 dark:border-white/30 w-[275px] p-6">
      <h2 className="text-xl font-semibold">
        {INSTALL_SNAP.HEAD_1}
      </h2>
      <p className="text-sm pt-5 pb-7">
        {INSTALL_SNAP.PARA_1}
      </p>
      <ReconnectButton/>
    </div>
  )
}
