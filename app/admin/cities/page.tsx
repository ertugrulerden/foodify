import { getAllCities } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const cities = getAllCities()

  return (
    <DataTable
        title="Cities"
        data={cities}
        columns={[
            { header: "ID", accessor: "cityID" },
            { header: "City", accessor: "city" },
        ]}
    />
  )
}
export default page
