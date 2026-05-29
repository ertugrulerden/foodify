import NavbarBrand from "./NavbarBrand";
import SearchBar from "./SearchBar";
import LocationSelector from "./LocationSelector";
import NavActions from "./NavActions";
import UserMenu from "./UserMenu";

// Navbar: Üst navigasyon çubuğu
// Sol taraf: Logo + Adres Seçici + Arama Çubuğu
// Sağ taraf: Aksiyonlar (favoriler, sepet vb.) + Kullanıcı menüsü
const Navbar = () => {
  return (
    <nav className="w-full p-1.5 border-b flex items-center justify-between">

		{/* Sol kısım: Logo, adres seçici ve arama çubuğu yan yana */}
		<div id="left-section" className="flex flex-1 items-center gap-4">
			<NavbarBrand/>
			{/* LocationSelector artık arama çubuğunun hemen solunda */}
			<LocationSelector/>
			<SearchBar/>
		</div>

		{/* Sağ kısım: Favori, sepet, bildirim, dil, kullanıcı */}
		<div id="right-section" className="flex items-center gap-6">
			<NavActions/>
			<UserMenu/>
		</div>

    </nav>
  )
}

export default Navbar
