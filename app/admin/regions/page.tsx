import { CrudPage } from "@/components/admin/CrudPage"
import { getAllRegions, getAllDistricts } from "@/lib/data/queries"
import { saveRegionAction, deleteRegionAction } from "./actions"

const Page = () => {
  const districts = getAllDistricts()
  const distMap = Object.fromEntries(districts.map(d => [d.districtID, d.district]))
  const data = getAllRegions().map(r => ({
    regionID: r.regionID,
    region: r.region,
    districtID: r.districtID,
    _district: distMap[r.districtID] ?? r.districtID,
  }))
  return (
    <CrudPage
      title="Regions"
      data={data}
      columns={[
        { header: "ID", accessor: "regionID" },
        { header: "Region", accessor: "region" },
        { header: "District", accessor: "_district" },
      ]}
      emptyItem={{ regionID: 0, region: "", districtID: 0, _district: "" }}
      fields={[
        { name: "region", label: "Region", type: "text", required: true },
        { name: "districtID", label: "District", type: "select", required: true, options: districts.map(d => ({ value: d.districtID, label: d.district })) },
      ]}
      idField="regionID"
      displayField="region"
      onSave={saveRegionAction}
      onDelete={deleteRegionAction}
    />
  )
}
export default Page
