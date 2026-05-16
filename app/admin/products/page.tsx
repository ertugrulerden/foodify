import { getAllProducts, getAllRestaurants } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const products = getAllProducts()
    const restaurants = getAllRestaurants()
    const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))

  return (
    <DataTable
        title="Products"
        data={products}
        columns={[
            { header: "ID", accessor: "productID" },
            { header: "Name", accessor: "name" },
            { header: "Restaurant ID", accessor: (p) => `${p.restaurantID} - ${restMap[p.restaurantID] ?? p.restaurantID}` },
            { header: "Description", accessor: "description" },
        ]}
    />
  )
}

export default page
