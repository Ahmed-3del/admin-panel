/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"

export function DeleteServiceModal({ data, onConfirm, refetch }: any) {
    const { closeModal } = useModal()

    const handleDelete = async () => {
        try {
            await onConfirm?.(data?._id)
            refetch?.()
            closeModal()
        } catch (error) {
            console.error("Error deleting Service:", error)
        }
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete Service</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete <strong>{data?.name}</strong>? This action cannot be undone and will
                    permanently remove all service data.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete Service
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
