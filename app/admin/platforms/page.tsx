import { getAllPlatforms } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const platforms = getAllPlatforms()

  return (
    <DataTable
        title="Platforms"
        data={platforms}
        columns={[
            { header: "ID", accessor: "platformID" },
            { header: "Name", accessor: "platform" },
        ]}
    />
  )
}

export default page
