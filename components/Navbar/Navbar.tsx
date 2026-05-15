import NavbarBrand from "./NavbarBrand";
import SearchBar from "./SearchBar";
import LocationSelector from "./LocationSelector";
import NavActions from "./NavActions";
import UserMenu from "./UserMenu";


const Navbar = () => {
  return (
    <nav className="w-full border-b pt-2 flex items-center justify-between">

		<div id="left-section" className="flex items-center gap-8">
			<NavbarBrand/>
			<SearchBar/>
		</div>


		<div id="right-section" className="flex items-center gap-6">
			<LocationSelector/>
			<NavActions/>
			<UserMenu/>
		</div>

    </nav>
  )
}

export default Navbar
