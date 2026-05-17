"use client"

import { useState, useTransition } from "react"
import type { Platform } from "@/lib/data/types"
import { DataTable } from "@/components/admin/DataTable"
import { RowActions } from "../RowActions"
import { deletePlatformAction, savePlatformAction } from "./actions"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


export function PlatformsClient({ data }: { data: Platform[] }) {
  const [editing, setEditing] = useState<Platform | null>(null)
  const [deleting, setDeleting] = useState<Platform | null>(null)

  const emptyItem = { platformID: 0, platform: "" } as Platform

	const [isPending, startTransition] = useTransition()
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		startTransition(async () => {
			const result = await savePlatformAction(null, formData)
			if (result.success) {
				toast.success(result.msg)
				setEditing(null)
			} else {
				toast.error(result.error)
			}
		})
	}

  return (
    <>
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null) }}>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Platforms</h1>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(emptyItem)}>+ Add Platform</Button>
          </DialogTrigger>
        </div>

        <DialogContent>
		  <DialogTitle>{editing?.platformID ? "Edit Platform" : "Add Platform"}</DialogTitle>

          <form onSubmit={handleSubmit}>
            {editing?.platformID ? <input type="hidden" name="id" value={editing.platformID} /> : null}
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input id="name" name="name" defaultValue={editing?.platform ?? ""} required />
            <Button type="submit" className="mt-4" disabled={isPending}>Save</Button>
          </form>

        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null) }}>
        <DialogContent>
          <DialogTitle>Delete {deleting?.platform}?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <div className="flex justify-end gap-3 mt-4">

			<Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
			<Button onClick={async () => {
				const result = await deletePlatformAction(deleting!.platformID)
				if (result.success) {
					setDeleting(null)
					toast.success(result.msg)
				} else {
					toast.error(result.error)
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
            header: "",
            className: "w-[1%]",
            accessor: (p: Platform) => (
              <RowActions item={p} onEdit={setEditing} onDelete={setDeleting} />
            ),
          },
          { header: "ID", accessor: "platformID" },
          { header: "Name", accessor: "platform" },
        ]}
      />
    </>
  )
}
