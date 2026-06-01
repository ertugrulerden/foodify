import { CrudPage } from "@/components/admin/CrudPage"
import { getAdminPriceRows, getAllPlatforms } from "@/lib/data/queries"
import { savePriceAction, deletePriceAction } from "./actions"

const Page = () => {
  const platforms = getAllPlatforms()
  const platMap = Object.fromEntries(platforms.map(p => [p.platformID, p.platform]))
  // Fiyat tablosu cok buyudugu icin admin ekrani ilk acilista son 500 kaydi gosteriyor.
  const data = getAdminPriceRows().map(p => ({
    id: p.id,
    productID: p.productID,
    platformID: p.platformID,
    price: p.price,
    lastUpdated: p.lastUpdated,
    _product: `${p.productID} - ${p.productName}`,
    _platform: `${p.platformID} - ${platMap[p.platformID] ?? p.platformName}`,
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
        { name: "productID", label: "Product ID", type: "number", required: true },
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
