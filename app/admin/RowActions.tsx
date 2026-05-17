"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RowActionsProps<T> {
    item: T
    onEdit: (item: T) => void
    onDelete: (item: T) => void
}

export function RowActions<T>({ item, onEdit, onDelete }: RowActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-16 font-bold text-lg">⋮</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(item)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}