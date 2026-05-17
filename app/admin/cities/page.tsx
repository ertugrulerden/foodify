import { getAllCities } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const cities = getAllCities()

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Cities</h1>
        <DataTable
        data={cities}
        columns={[
            { header: "ID", accessor: "cityID" },
            { header: "City", accessor: "city" },
        ]}
    />
    </>
  )
}
export default page
