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
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all">
      <nav className="container mx-auto max-w-7xl h-16 px-4 md:px-8 flex items-center justify-between gap-6">

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
    </header>
  )
}

export default Navbar
