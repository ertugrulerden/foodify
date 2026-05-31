import { CrudPage } from "@/components/admin/CrudPage"
import { getAllDetails, getAllRestaurants, getAllPlatforms } from "@/lib/data/queries"
import { saveDetailAction, deleteDetailAction } from "./actions"

const Page = () => {
  const restaurants = getAllRestaurants()
  const platforms = getAllPlatforms()
  const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
  const platMap = Object.fromEntries(platforms.map(p => [p.platformID, p.platform]))
  const data = getAllDetails().map(d => ({
    id: d.id,
    restaurantID: d.restaurantID,
    platformID: d.platformID,
    rating: d.rating,
    fee: d.fee,
    deliveryTime: d.deliveryTime,
    minCart: d.minCart,
    sourceLink: d.sourceLink,
    _restaurant: `${d.restaurantID} - ${restMap[d.restaurantID] ?? d.restaurantID}`,
    _platform: `${d.platformID} - ${platMap[d.platformID] ?? d.platformID}`,
  }))
  return (
    <CrudPage
      title="Details"
      data={data}
      columns={[
        { header: "ID", accessor: "id" },
        { header: "Restaurant ID", accessor: "_restaurant" },
        { header: "Platform ID", accessor: "_platform" },
        { header: "Rating", accessor: "rating" },
        { header: "Fee", accessor: "fee" },
        { header: "Delivery Time", accessor: "deliveryTime" },
        { header: "Min Cart", accessor: "minCart" },
        { header: "Source Link", accessor: "sourceLink" },
      ]}
      emptyItem={{ id: 0, restaurantID: 0, platformID: 0, rating: 0, fee: 0, deliveryTime: "", minCart: 0, sourceLink: "", _restaurant: "", _platform: "" }}
      fields={[
        { name: "restaurantID", label: "Restaurant", type: "select", required: true, options: restaurants.map(r => ({ value: r.restaurantID, label: r.name })) },
        { name: "platformID", label: "Platform", type: "select", required: true, options: platforms.map(p => ({ value: p.platformID, label: p.platform })) },
        { name: "rating", label: "Rating", type: "number", required: true },
        { name: "fee", label: "Fee", type: "number", required: true },
        { name: "deliveryTime", label: "Delivery Time", type: "text" },
        { name: "minCart", label: "Min Cart", type: "number" },
        { name: "sourceLink", label: "Source Link", type: "text" },
      ]}
      idField="id"
      displayField="id"
      onSave={saveDetailAction}
      onDelete={deleteDetailAction}
    />
  )
}
export default Page
