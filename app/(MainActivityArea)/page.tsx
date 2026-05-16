import RestaurantCard from "@/components/Homepage/RestaurantCard"
import { popularRestaurants } from "@/lib/data/homepage"


const page = () => {
  return (
    <div>
      
    	<h2>yo</h2>
		
		{popularRestaurants.map((r,i) => (
			<RestaurantCard key={i} {...r}/>
		))}
    </div>
  )
}

export default page
