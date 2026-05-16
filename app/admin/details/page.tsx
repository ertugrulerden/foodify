import { getAllDetails, getAllRestaurants, getAllPlatforms } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const details = getAllDetails()
    const restaurants = getAllRestaurants()
    const platforms = getAllPlatforms()
    const restMap = Object.fromEntries(restaurants.map(r => [r.restaurantID, r.name]))
    const platMap = Object.fromEntries(platforms.map(p => [p.platformID, p.platform]))

  return (
    <DataTable
        title="Details"
        data={details}
        columns={[
            { header: "ID", accessor: "id" },
            { header: "Restaurant ID", accessor: (d) => `${d.restaurantID} - ${restMap[d.restaurantID] ?? d.restaurantID}` },
            { header: "Platform ID", accessor: (d) => `${d.platformID} - ${platMap[d.platformID] ?? d.platformID}` },
            { header: "Rating", accessor: "rating" },
            { header: "Fee", accessor: "fee" },
        ]}
    />
  )
}

export default page
