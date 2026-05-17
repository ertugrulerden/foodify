import { getAllRestaurants } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const restaurants = getAllRestaurants()

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Restaurants</h1>
        <DataTable
        data={restaurants}
        columns={[
            { header: "ID", accessor: "restaurantID" },
            { header: "Name", accessor: "name" },
            { header: "Active", accessor: (r) => r.isActive ? "Yes" : "No" },
        ]}
    />
    </>
  )
}

export default page
