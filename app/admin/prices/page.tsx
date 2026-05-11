import { getAllPrices } from "@/lib/data/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/ui/table"

const page = () => {
    const prices = getAllPrices()

  return (
    <div>
        <h1 className="mb-10 text-xl font-bold">Prices</h1>

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>PRODUCT</TableHead>
                <TableHead>PLATFORM</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>UPDATED</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {prices.map((p)=>(
                    <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.productID}</TableCell>
                        <TableCell>{p.platformID}</TableCell>
                        <TableCell>{p.price}</TableCell>
                        <TableCell>{p.lastUpdated}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default page
