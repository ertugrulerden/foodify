import { CrudPage } from "@/components/admin/CrudPage"
import { getAllUserFavs, getAllUsers, getAllProducts } from "@/lib/data/queries"
import { saveUserFavAction, deleteUserFavAction } from "./actions"

const Page = () => {
  const users = getAllUsers()
  const products = getAllProducts()
  const userMap = Object.fromEntries(users.map(u => [u.userID, u.email]))
  const prodMap = Object.fromEntries(products.map(p => [p.productID, p.name]))
  const data = getAllUserFavs().map(f => ({
    favID: f.favID,
    userID: f.userID,
    productID: f.productID,
    _user: `${f.userID} - ${userMap[f.userID] ?? f.userID}`,
    _product: `${f.productID} - ${prodMap[f.productID] ?? f.productID}`,
  }))
  return (
    <CrudPage
      title="User Favorites"
      data={data}
      columns={[
        { header: "Fav ID", accessor: "favID" },
        { header: "User ID", accessor: "_user" },
        { header: "Product ID", accessor: "_product" },
      ]}
      emptyItem={{ favID: 0, userID: 0, productID: 0, _user: "", _product: "" }}
      fields={[
        { name: "userID", label: "User", type: "select", required: true, options: users.map(u => ({ value: u.userID, label: u.email })) },
        { name: "productID", label: "Product", type: "select", required: true, options: products.map(p => ({ value: p.productID, label: p.name })) },
      ]}
      idField="favID"
      displayField="favID"
      onSave={saveUserFavAction}
      onDelete={deleteUserFavAction}
    />
  )
}
export default Page
