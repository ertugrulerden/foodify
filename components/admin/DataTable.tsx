import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import type { Column } from "./types"
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
}

function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <div>
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