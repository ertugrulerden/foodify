import { getAllRestaurants } from "@/lib/data/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/ui/table"

const page = () => {
    const restaurants = getAllRestaurants()

  return (
    <div>
        <h1 className="mb-10 text-xl font-bold">Restaurants</h1>

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>ACTIVE</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {restaurants.map((r)=>(
                    <TableRow key={r.restaurantID}>
                        <TableCell>{r.restaurantID}</TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.isActive ? "Yes" : "No"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default page
