import { getAllPlatforms } from "@/lib/data/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader,TableRow } from "@/components/ui/table"

const page = () => {
    const platforms = getAllPlatforms()

  return (
    <div>
        <h1 className="mb-10 text-xl font-bold">Platforms</h1>
        {/* <pre>{JSON.stringify(platforms, null, 2)}</pre> */}

        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                </TableRow>
            </TableHeader>
            
            <TableBody>

                {platforms.map((p)=>(
                    <TableRow key={p.platformID}>
                        <TableCell>{p.platformID}</TableCell>
                        <TableCell>{p.platform}</TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    </div>
  )
}

export default page
