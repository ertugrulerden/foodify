import { CrudPage } from "@/components/admin/CrudPage"
import { getAllDistricts, getAllCities } from "@/lib/data/queries"
import { saveDistrictAction, deleteDistrictAction } from "./actions"

const Page = () => {
  const cities = getAllCities()
  const cityMap = Object.fromEntries(cities.map(c => [c.cityID, c.city]))
  const data = getAllDistricts().map(d => ({
    districtID: d.districtID,
    district: d.district,
    cityID: d.cityID,
    _city: `${d.cityID} - ${cityMap[d.cityID] ?? d.cityID}`,
  }))
  return (
    <CrudPage
      title="Districts"
      data={data}
      columns={[
        { header: "ID", accessor: "districtID" },
        { header: "District", accessor: "district" },
        { header: "City ID", accessor: "_city" },
      ]}
      emptyItem={{ districtID: 0, district: "", cityID: 0, _city: "" }}
      fields={[
        { name: "district", label: "District", type: "text", required: true },
        { name: "cityID", label: "City", type: "select", required: true, options: cities.map(c => ({ value: c.cityID, label: c.city })) },
      ]}
      idField="districtID"
      displayField="district"
      onSave={saveDistrictAction}
      onDelete={deleteDistrictAction}
    />
  )
}
export default Page
