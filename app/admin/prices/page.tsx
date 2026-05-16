import { getAllPrices, getAllProducts, getAllPlatforms } from "@/lib/data/queries"
import { DataTable } from "@/components/admin/DataTable"

const page = () => {
    const prices = getAllPrices()
    const products = getAllProducts()
    const platforms = getAllPlatforms()
    const prodMap = Object.fromEntries(products.map(p => [p.productID, p.name]))
    const platMap = Object.fromEntries(platforms.map(p => [p.platformID, p.platform]))

  return (
    <DataTable
        title="Prices"
        data={prices}
        columns={[
            { header: "ID", accessor: "id" },
            { header: "Product", accessor: (p) => prodMap[p.productID] ?? p.productID },
            { header: "Platform", accessor: (p) => platMap[p.platformID] ?? p.platformID },
            { header: "Price", accessor: "price" },
            { header: "Updated", accessor: "lastUpdated" },
        ]}
    />
  )
}

export default page
