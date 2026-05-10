import { getAllProducts } from "@/lib/data/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/ui/table"

const page = () => {
    const products = getAllProducts()

  return (
    <div>
        <h1 className="mb-10 text-xl font-bold">Products</h1>

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>RESTAURANT</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.map((p)=>(
                    <TableRow key={p.productID}>
                        <TableCell>{p.productID}</TableCell>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.restaurantID}</TableCell>
                        <TableCell>{p.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default page
