import { getAllRestaurantRegions, getAllRestaurants, getAllRegions } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const rrs = getAllRestaurantRegions()
    const restaurants = getAllRestaurants()
    const regions = getAllRegions()
    const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
    const regionMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))

  return (
    <DataTable
        title="Restaurant Regions"
        data={rrs}
        columns={[
            { header: "Restaurant", accessor: (rr) => restMap[rr.restaurantID] ?? rr.restaurantID },
            { header: "Region", accessor: (rr) => regionMap[rr.regionID] ?? rr.regionID },
        ]}
    />
  )
}
export default page
