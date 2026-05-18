import Navbar from "@/components/Navbar/Navbar"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="h-screen flex flex-col">

        <Navbar/>
        <main className="flex-1 overflow-y-auto">
        {children}
        </main>
    </div>
  )
}

export default layout
