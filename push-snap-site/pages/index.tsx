import Navbar from "@/components/layouts/Navbar"
import InstallSnap from "@/components/content/InstallSnap"
import NotificationTests from "@/components/content/NotificationTests"
import Note from "@/components/content/Note"
import Footer from "@/components/layouts/Footer"
import Heading from "@/components/content/Heading"
import AddAddress from "@/components/content/AddAddress"

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <section className="sm:h-[calc(100vh-17.5vh)] flex flex-col items-center justify-center w-max mx-auto py-10">
        <Heading/>
        <div className="flex flex-col sm:flex-row items-center justify-center pt-10 sm:pt-12 sm:pb-12">
          <div className="sm:mr-6">
            <InstallSnap/>
          </div>
          <div className="my-6 sm:my-0 sm:ml-6">
            <NotificationTests/>
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
