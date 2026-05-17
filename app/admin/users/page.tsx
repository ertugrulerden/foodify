import { CrudPage } from "@/components/admin/CrudPage"
import { getAllUsers, getAllRegions } from "@/lib/data/queries"
import { saveUserAction, deleteUserAction } from "./actions"

const Page = () => {
  const regions = getAllRegions()
  const regMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))
  const data = getAllUsers().map(u => ({
    userID: u.userID,
    email: u.email,
    passwordHash: u.passwordHash,
    lastRegionID: u.lastRegionID,
    _region: regMap[u.lastRegionID] ?? u.lastRegionID,
  }))
  return (
    <CrudPage
      title="Users"
      data={data}
      columns={[
        { header: "ID", accessor: "userID" },
        { header: "Email", accessor: "email" },
        { header: "Region", accessor: "_region" },
      ]}
      emptyItem={{ userID: 0, email: "", passwordHash: "", lastRegionID: 0, _region: "" }}
      fields={[
        { name: "email", label: "Email", type: "text", required: true },
        { name: "passwordHash", label: "Password Hash", type: "text", required: true },
        { name: "lastRegionID", label: "Region", type: "select", required: true, options: regions.map(r => ({ value: r.regionID, label: r.region })) },
      ]}
      idField="userID"
      displayField="email"
      onSave={saveUserAction}
      onDelete={deleteUserAction}
    />
  )
}
export default Page
