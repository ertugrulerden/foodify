import { CrudPage } from "@/components/admin/CrudPage"
import { getAllPrices, getAllProducts, getAllPlatforms } from "@/lib/data/queries"
import { savePriceAction, deletePriceAction } from "./actions"

const Page = () => {
  const products = getAllProducts()
  const platforms = getAllPlatforms()
  const prodMap = Object.fromEntries(products.map(p => [p.productID, p.name]))
  const platMap = Object.fromEntries(platforms.map(p => [p.platformID, p.platform]))
  const data = getAllPrices().map(p => ({
    id: p.id,
    productID: p.productID,
    platformID: p.platformID,
    price: p.price,
    lastUpdated: p.lastUpdated,
    _product: `${p.productID} - ${prodMap[p.productID] ?? p.productID}`,
    _platform: `${p.platformID} - ${platMap[p.platformID] ?? p.platformID}`,
  }))
  return (
    <CrudPage
      title="Prices"
      data={data}
      columns={[
        { header: "ID", accessor: "id" },
        { header: "Product ID", accessor: "_product" },
        { header: "Platform ID", accessor: "_platform" },
        { header: "Price", accessor: "price" },
        { header: "Updated", accessor: "lastUpdated" },
      ]}
      emptyItem={{ id: 0, productID: 0, platformID: 0, price: 0, lastUpdated: "", _product: "", _platform: "" }}
      fields={[
        { name: "productID", label: "Product", type: "select", required: true, options: products.map(p => ({ value: p.productID, label: p.name })) },
        { name: "platformID", label: "Platform", type: "select", required: true, options: platforms.map(p => ({ value: p.platformID, label: p.platform })) },
        { name: "price", label: "Price", type: "number", required: true },
      ]}
      idField="id"
      displayField="id"
      onSave={savePriceAction}
      onDelete={deletePriceAction}
    />
  )
}
export default Page
