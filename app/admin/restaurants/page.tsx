import { CrudPage } from "@/components/admin/CrudPage"
import { getAllRestaurants } from "@/lib/data/queries"
import { saveRestaurantAction, deleteRestaurantAction } from "./actions"

const Page = () => {
  const data = getAllRestaurants().map(r => ({
    restaurantID: r.restaurantID,
    name: r.name,
    isActive: r.isActive ? "Yes" : "No",
    _isActive: r.isActive,
  }))
  return (
    <CrudPage
      title="Restaurants"
      data={data}
      columns={[
        { header: "ID", accessor: "restaurantID" },
        { header: "Name", accessor: "name" },
        { header: "Active", accessor: "isActive" },
      ]}
      emptyItem={{ restaurantID: 0, name: "", isActive: "No", _isActive: true }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "isActive", label: "Active", type: "select", required: true, options: [{ value: "on", label: "Yes" }, { value: "", label: "No" }] },
      ]}
      idField="restaurantID"
      displayField="name"
      onSave={saveRestaurantAction}
      onDelete={deleteRestaurantAction}
    />
  )
}
export default Page
