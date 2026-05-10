import { getAllDetails } from "@/lib/data/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/ui/table"

const page = () => {
    const details = getAllDetails()

  return (
    <div>
        <h1 className="mb-10 text-xl font-bold">Details</h1>

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>RESTAURANT</TableHead>
                <TableHead>PLATFORM</TableHead>
                <TableHead>RATING</TableHead>
                <TableHead>FEE</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {details.map((d)=>(
                    <TableRow key={d.id}>
                        <TableCell>{d.id}</TableCell>
                        <TableCell>{d.restaurantID}</TableCell>
                        <TableCell>{d.platformID}</TableCell>
                        <TableCell>{d.rating}</TableCell>
                        <TableCell>{d.fee}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default page
