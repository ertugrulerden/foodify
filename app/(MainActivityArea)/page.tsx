import HeroSection from "@/components/Homepage/HeroSection"
import RestaurantCard from "@/components/Homepage/RestaurantCard"
import { popularRestaurants } from "@/lib/data/homepage"

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      {popularRestaurants.map((r,i) => (
			  <RestaurantCard key={i} {...r}/>
		  ))}
    </main>
  )
}

export default HomePage
