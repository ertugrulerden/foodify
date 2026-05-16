import { getAllDistricts, getAllCities } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const districts = getAllDistricts()
    const cities = getAllCities()
    const cityMap = Object.fromEntries(cities.map(c => [c.cityID, c.city]))

  return (
    <DataTable
        title="Districts"
        data={districts}
        columns={[
            { header: "ID", accessor: "districtID" },
            { header: "District", accessor: "district" },
            { header: "City", accessor: (d) => cityMap[d.cityID] ?? d.cityID },
        ]}
    />
  )
}
export default page
