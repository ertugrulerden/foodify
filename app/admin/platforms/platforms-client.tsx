"use client"

import { useState } from "react"
import type { Platform } from "@/lib/data/types"
import { DataTable } from "@/components/admin/DataTable"
import { RowActions } from "../RowActions"
import { createPlatformAction, updatePlatformAction, deletePlatformAction } from "./actions"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function PlatformsClient({ data }: { data: Platform[] }) {
  const [editing, setEditing] = useState<Platform | null>(null)
  const [deleting, setDeleting] = useState<Platform | null>(null)

  const emptyItem = { platformID: 0, platform: "" } as Platform

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

          <form action={editing?.platformID ? updatePlatformAction : createPlatformAction}>
            {editing?.platformID ? <input type="hidden" name="id" value={editing.platformID} /> : null}
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input id="name" name="name" defaultValue={editing?.platform ?? ""} required />
            <Button type="submit" className="mt-4">Save</Button>
          </form>

        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null) }}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {deleting?.platform}?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <div className="flex justify-end gap-3 mt-4">

			<Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
			<Button onClick={async () => {
				const result = await deletePlatformAction(deleting!.platformID)
				if (result.success) {
					setDeleting(null)
				} else {
					toast.error(result.error)
				}
				}}>
				Delete
			</Button>

          </div>
        </AlertDialogContent>
      </AlertDialog>

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
