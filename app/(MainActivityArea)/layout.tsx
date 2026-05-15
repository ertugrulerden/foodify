import Navbar from "@/components/ui/Navbar/Navbar"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        <Navbar></Navbar>
        {children}
    </>
  )
}

export default layout
