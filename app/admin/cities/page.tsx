import { CrudPage } from "@/components/admin/CrudPage"
import { getAllCities } from "@/lib/data/queries"
import { saveCityAction, deleteCityAction } from "./actions"
import type { City } from "@/lib/data/types"

const Page = () => (
  <CrudPage<City>
    title="Cities"
    data={getAllCities()}
    columns={[
      { header: "ID", accessor: "cityID" },
      { header: "City", accessor: "city" },
    ]}
    emptyItem={{ cityID: 0, city: "" }}
    fields={[
      { name: "city", label: "City name", type: "text", required: true },
    ]}
    idField="cityID"
    displayField="city"
    onSave={saveCityAction}
    onDelete={deleteCityAction}
  />
)
export default Page
