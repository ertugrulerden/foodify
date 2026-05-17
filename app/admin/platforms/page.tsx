import { CrudPage } from "@/components/admin/CrudPage"
import { getAllPlatforms } from "@/lib/data/queries"
import { savePlatformAction, deletePlatformAction } from "./actions"
import type { Platform } from "@/lib/data/types"
const Page = () => (
  <CrudPage<Platform>
    title="Platforms"
    data={getAllPlatforms()}
    columns={[
      { header: "ID", accessor: "platformID" },
      { header: "Name", accessor: "platform" },
    ]}
    emptyItem={{ platformID: 0, platform: "" }}
    fields={[
      { name: "name", label: "Name", type: "text", required: true, entityField: "platform" },
    ]}
    idField="platformID"
    displayField="platform"
    onSave={savePlatformAction}
    onDelete={deletePlatformAction}
  />
)
export default Page