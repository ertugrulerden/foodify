import { getAllDistricts, getAllCities } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const districts = getAllDistricts()
    const cities = getAllCities()
    const cityMap = Object.fromEntries(cities.map(c => [c.cityID, c.city]))

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Districts</h1>
        <DataTable
        data={districts}
        columns={[
            { header: "ID", accessor: "districtID" },
            { header: "District", accessor: "district" },
            { header: "City ID", accessor: (d) => `${d.cityID} - ${cityMap[d.cityID] ?? d.cityID}` },
        ]}
    />
    </>
  )
}
export default page
