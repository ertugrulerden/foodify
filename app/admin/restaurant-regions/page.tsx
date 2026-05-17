import { getAllRestaurantRegions, getAllRestaurants, getAllRegions } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const rrs = getAllRestaurantRegions()
    const restaurants = getAllRestaurants()
    const regions = getAllRegions()
    const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
    const regionMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Restaurant Regions</h1>
        <DataTable
        data={rrs}
        columns={[
            { header: "Restaurant ID", accessor: (rr) => `${rr.restaurantID} - ${restMap[rr.restaurantID] ?? rr.restaurantID}` },
            { header: "Region ID", accessor: (rr) => `${rr.regionID} - ${regionMap[rr.regionID] ?? rr.regionID}` },
        ]}
    />
    </>
  )
}
export default page
