import Image from 'next/image'
import Metamask from '../../public/assets/metamask-original.png' 

export default function Footer() {
  return (
    <div className="flex justify-center w-full border-t-2 dark:border-white/30 py-5">
      <div className="dark:bg-bg-secondary flex items-center rounded-lg shadow-lg p-2">
        <div>
          <Image src={Metamask} alt="MetaMask Logo" width="32" height="32"/>
        </div>
        <div className="ml-2">
          <p className="text-[10px] font-light dark:text-white/70 leading-none">powered by</p>
          <p className="font-light leading-none">METAMASK</p>
        </div>
      </div>
    </div>
  )
}
