import { CrudPage } from "@/components/admin/CrudPage"
import { getAllUsers, getAllRegions } from "@/lib/data/queries"
import { saveUserAction, deleteUserAction } from "./actions"

const Page = () => {
  const regions = getAllRegions()
  const regMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))
  const data = getAllUsers().map(u => ({
    userID: u.userID,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    passwordHash: u.passwordHash,
    lastRegionID: u.lastRegionID,
    _region: `${u.lastRegionID} - ${regMap[u.lastRegionID] ?? u.lastRegionID}`,
  }))
  return (
    <CrudPage
      title="Users"
      data={data}
      columns={[
        { header: "ID", accessor: "userID" },
        { header: "First Name", accessor: "firstName" },
        { header: "Last Name", accessor: "lastName" },
        { header: "Email", accessor: "email" },
        { header: "Last Region ID", accessor: "_region" },
      ]}
      emptyItem={{ userID: 0, firstName: "", lastName: "", email: "", passwordHash: "", lastRegionID: 0, _region: "" }}
      fields={[
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
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
