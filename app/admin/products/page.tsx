import { CrudPage } from "@/components/admin/CrudPage"
import { getAllProducts, getAllRestaurants } from "@/lib/data/queries"
import { saveProductAction, deleteProductAction } from "./actions"

const Page = () => {
  const restaurants = getAllRestaurants()
  const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
  const data = getAllProducts().map(p => ({
    productID: p.productID,
    name: p.name,
    restaurantID: p.restaurantID,
    description: p.description,
    _restaurant: restMap[p.restaurantID] ?? p.restaurantID,
  }))
  return (
    <CrudPage
      title="Products"
      data={data}
      columns={[
        { header: "ID", accessor: "productID" },
        { header: "Name", accessor: "name" },
        { header: "Restaurant", accessor: "_restaurant" },
        { header: "Description", accessor: "description" },
      ]}
      emptyItem={{ productID: 0, name: "", restaurantID: 0, description: null, _restaurant: "" }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "restaurantID", label: "Restaurant", type: "select", required: true, options: restaurants.map(r => ({ value: r.restaurantID, label: r.name })) },
        { name: "description", label: "Description", type: "text" },
      ]}
      idField="productID"
      displayField="name"
      onSave={saveProductAction}
      onDelete={deleteProductAction}
    />
  )
}
export default Page
