import Navbar from "@/components/Navbar/Navbar"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        <Navbar></Navbar>
        {children}
    </>
  )
}

export default layout
