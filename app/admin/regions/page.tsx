import { getAllRegions, getAllDistricts } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const regions = getAllRegions()
    const districts = getAllDistricts()
    const districtMap = Object.fromEntries(districts.map(d => [d.districtID, d.district]))

  return (
    <DataTable
        title="Regions"
        data={regions}
        columns={[
            { header: "ID", accessor: "regionID" },
            { header: "Region", accessor: "region" },
            { header: "District", accessor: (r) => districtMap[r.districtID] ?? r.districtID },
        ]}
    />
  )
}
export default page
