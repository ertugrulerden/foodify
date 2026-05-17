import { CrudPage } from "@/components/admin/CrudPage"
import { getAllRestaurantRegions, getAllRestaurants, getAllRegions } from "@/lib/data/queries"
import { saveRestaurantRegionAction, deleteRestaurantRegionAction } from "./actions"

const Page = () => {
  const restaurants = getAllRestaurants()
  const regions = getAllRegions()
  const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
  const regionMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))
  const data = getAllRestaurantRegions().map(r => ({
    id: r.id,
    _restaurant: `${r.restaurantID} - ${restMap[r.restaurantID] ?? r.restaurantID}`,
    _region: `${r.regionID} - ${regionMap[r.regionID] ?? r.regionID}`,
    restaurantID: r.restaurantID,
    regionID: r.regionID,
  }))
  return (
    <CrudPage
      title="Restaurant Regions"
      data={data}
      columns={[
        { header: "Restaurant ID", accessor: "_restaurant" },
        { header: "Region ID", accessor: "_region" },
      ]}
      emptyItem={{ id: 0, restaurantID: 0, regionID: 0, _restaurant: "", _region: "" }}
      fields={[
        { name: "restaurantID", label: "Restaurant", type: "select", required: true, options: restaurants.map(r => ({ value: r.restaurantID, label: r.name })) },
        { name: "regionID", label: "Region", type: "select", required: true, options: regions.map(p => ({ value: p.regionID, label: p.region })) },
      ]}
      idField="id"
      displayField="id"
      onSave={saveRestaurantRegionAction}
      onDelete={deleteRestaurantRegionAction}
    />
  )
}
export default Page
