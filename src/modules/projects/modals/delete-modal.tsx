/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"

export function DeleteProjectModal({ data, onConfirm, refetch }: any) {
    const { closeModal } = useModal()

    const handleDelete = async () => {
        await onConfirm?.(data?.id)
        refetch?.()
        closeModal()
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete <strong>{data?.name}</strong>? This action cannot be undone and will
                    permanently remove all project data.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete Project
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
