import Link from "next/link"


const NavbarBrand = () => {
  return (
    <Link href="/" id="logo" className="text-2xl font-black tracking-tight shrink-0 flex items-center gap-1">
      <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">FOODIFY</span>
    </Link>   
  )
}

export default NavbarBrand
