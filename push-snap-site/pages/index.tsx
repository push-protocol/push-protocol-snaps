import Navbar from "@/components/layouts/Navbar"
import InstallSnap from "@/components/content/InstallSnap"
import NotificationTests from "@/components/content/NotificationTests"
import ChatTests from "@/components/content/ChatTests"
import Note from "@/components/content/Note"
import Footer from "@/components/layouts/Footer"
import Heading from "@/components/content/Heading"
import AddAddress from "@/components/content/AddAddress"
import SnapOptInButton from "@/components/SnapButton/SnapOptInButton"
import { useSigner } from "wagmi"

export default function Home() {

  const { data: signer, isError, isLoading } = useSigner()

  return (
    <main className="">
      <Navbar />
      <section className="sm:h-[calc(100vh-17.5vh)] flex flex-col items-center justify-center w-max mx-auto py-10">
        <Heading/>
        <div className="flex flex-col sm:flex-row items-center justify-center pt-10 sm:pt-12 sm:pb-12">
          <div className="sm:mr-6">
            <InstallSnap/>
            <SnapOptInButton address={"0x28a292f4dC182492F7E23CFda4354bff688f6ea8"} signer={signer} />
          </div>
          <div className="my-6 sm:my-0 sm:ml-6">
            <NotificationTests/>
          </div>
          <div className="my-6 sm:my-0 sm:ml-6">
            <ChatTests/>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center ">
          <div className="my-6 sm:my-0 sm:mr-6">
            <Note/>
          </div>
          <div className="sm:ml-6">
            <AddAddress/>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}
