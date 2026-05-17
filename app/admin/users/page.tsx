import { getAllUsers, getAllRegions } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const users = getAllUsers()
    const regions = getAllRegions()
    const regionMap = Object.fromEntries(regions.map(r => [r.regionID, r.region]))

  return (
    <>
        <h1 className="mb-10 text-xl font-bold">Users</h1>
        <DataTable
        data={users}
        columns={[
            { header: "ID", accessor: "userID" },
            { header: "Email", accessor: "email" },
            { header: "Password Hash", accessor: (u) => u.passwordHash.slice(0, Math.floor(u.passwordHash.length / 4)) + "..." },
            { header: "Region ID", accessor: (u) => `${u.lastRegionID} - ${regionMap[u.lastRegionID] ?? u.lastRegionID}` },
        ]}
    />
    </>
  )
}
export default page
