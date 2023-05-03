import { ADD_ADDRESS } from "@/utils/constants"
import ConfirmButton from "../buttons/ConfirmButton"

export default function AddAddress() {
  return (
    <div className="flex flex-col justify-between dark:bg-bg-secondary text-sm rounded-[20px] border-2 dark:border-white/30 w-[275px] h-[226px] p-6">
        <h2 className="text-xl font-semibold">
            {ADD_ADDRESS.HEAD_1}
        </h2>
        <p>
            {ADD_ADDRESS.PARA_1}
        </p>
        <div>
            <ConfirmButton/>
        </div>    
    </div>
  )
}
