import { getAllUserFavs, getAllUsers, getAllProducts } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const favs = getAllUserFavs()
    const users = getAllUsers()
    const products = getAllProducts()
    const userMap = Object.fromEntries(users.map(u => [u.userID, u.email]))
    const prodMap = Object.fromEntries(products.map(p => [p.productID, p.name]))

  return (
    <DataTable
        title="User Favorites"
        data={favs}
        columns={[
            { header: "Fav ID", accessor: "favID" },
            { header: "User", accessor: (f) => userMap[f.userID] ?? f.userID },
            { header: "Product", accessor: (f) => prodMap[f.productID] ?? f.productID },
        ]}
    />
  )
}
export default page
