import { getAllRestaurants } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const restaurants = getAllRestaurants()

  return (
    <DataTable
        title="Restaurants"
        data={restaurants}
        columns={[
            { header: "ID", accessor: "restaurantID" },
            { header: "Name", accessor: "name" },
            { header: "Active", accessor: (r) => r.isActive ? "Yes" : "No" },
        ]}
    />
  )
}

export default page
