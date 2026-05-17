import HeroSection from "@/components/Homepage/HeroSection"
import PopularMenus from "@/components/Homepage/PopularMenus"
import PopularRestaurants from "@/components/Homepage/PopularRestaurants"

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <PopularRestaurants />
      <PopularMenus />

    </main>
  )
}

export default HomePage
