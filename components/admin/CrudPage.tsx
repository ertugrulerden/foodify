"use client"

import { useState, useTransition } from "react"
import { DataTable } from "./DataTable"
import { RowActions } from "./RowActions"
import type { Column } from "./types"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Result = { success: boolean; msg?: string; error?: string }

interface FieldConfig {
  name: string
  label: string
  type: "text" | "number" | "select"
  required?: boolean
  options?: { value: string | number; label: string }[]
  entityField?: string
}

interface CrudPageProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  emptyItem: T
  fields: FieldConfig[]
  idField: keyof T
  displayField: keyof T
  onSave: (prevState: unknown, formData: FormData) => Promise<Result>
  onDelete: (id: number) => Promise<Result>
}

export function CrudPage<T>({
  title, data, columns, emptyItem, fields, idField, displayField, onSave, onDelete,
}: CrudPageProps<T>) {
  const [editing, setEditing] = useState<T | null>(null)
  const [deleting, setDeleting] = useState<T | null>(null)
  const [isPending, startTransition] = useTransition()
  const editData = editing as Record<string, unknown> | null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await onSave(null, formData)
      if (result.success) {
        toast.success(result.msg ?? "Saved")
        setEditing(null)
      } else {
        toast.error(result.error ?? "Failed")
      }
    })
  }

  return (
    <>
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null) }}>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">{title}</h1>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(emptyItem)}>+ Add {title}</Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>{editing?.[idField] ? "Edit" : "Add"} {title}</DialogTitle>
          <form onSubmit={handleSubmit}>
            {editing?.[idField] ? <input type="hidden" name="id" value={String(editing[idField])} /> : null}
            {fields.map((field) => (
              <div key={field.name} className="mb-3">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "select" && field.options ? (
                  <select
                    name={field.name}
                    defaultValue={String(editData?.[field.entityField ?? field.name] ?? "")}
                    required={field.required}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs md:text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type === "number" ? "number" : "text"}
                    defaultValue={String(editData?.[field.entityField ?? field.name] ?? "")}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="mt-4" disabled={isPending}>Save</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null) }}>
        <DialogContent>
          <DialogTitle>Delete {String(deleting?.[displayField] ?? "")}?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button onClick={async () => {
              const result = await onDelete(Number(deleting?.[idField]))
              if (result.success) {
                setDeleting(null)
                toast.success(result.msg ?? "Deleted")
              } else {
                toast.error(result.error ?? "Failed")
              }
            }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable
        data={data}
        columns={[
          {
            header: "", className: "w-[1%]",
            accessor: (item: T) => (
              <RowActions item={item} onEdit={setEditing} onDelete={setDeleting} />
            ),
          },
          ...columns,
        ]}
      />
    </>
  )
}