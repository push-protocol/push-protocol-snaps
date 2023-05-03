import Image from 'next/image'
import MetaMask from '../../public/assets/metamask.png'

export default function ConnectWalletButton() {
  return (
    <button className="flex bg-white border text-black font-bold text-sm w-max p-2 rounded-lg">
      <Image src={MetaMask} alt='MetaMask Logo' height="20" width="20"/>
      <p className='pl-2'>
        Connect Wallet
      </p>
    </button>
  )
}
