import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import type { Column } from "./types"
interface DataTableProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
}


function DataTable<T>({ title, data, columns }: DataTableProps<T>) {
  return (
    <div>
      <h1 className="mb-10 text-xl font-bold">{title}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : String(item[col.accessor] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export { DataTable }