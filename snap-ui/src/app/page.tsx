"use client"

import SnapOptInButton from '@/components/SnapButton/SnapOptInButton'
import Image from 'next/image'
import { useSigner } from 'wagmi'

export default function Home() {
  const address = '0x28a292f4dC182492F7E23CFda4354bff688f6ea8'

  const { data: signer, isError, isLoading } = useSigner()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SnapOptInButton address={address} signer={signer}/>
    </main>
  )
}
