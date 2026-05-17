import { getAllRegions, getAllDistricts } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const regions = getAllRegions()
    const districts = getAllDistricts()
    const districtMap = Object.fromEntries(districts.map(d => [d.districtID, d.district]))

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Regions</h1>
        <DataTable
        data={regions}
        columns={[
            { header: "ID", accessor: "regionID" },
            { header: "Region", accessor: "region" },
            { header: "District ID", accessor: (r) => `${r.districtID} - ${districtMap[r.districtID] ?? r.districtID}` },
        ]}
    />
    </>
  )
}
export default page
