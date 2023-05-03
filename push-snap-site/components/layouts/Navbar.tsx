import ThemeToggleSwitch from "../buttons/ThemeToggleSwitch"
import ConnectWalletButton from "../buttons/ConnectWalletButton"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-5 border-b-2 dark:border-white/30">
        <div className=" text-xl font-bold">
          push-snap
        </div>
        <div className="flex items-center">
          <div>
            <ThemeToggleSwitch/>
          </div>
            <ConnectButton/>
        </div>
    </div>
  )
}
