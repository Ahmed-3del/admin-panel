/* eslint-disable import/no-cycle */

"use client"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ModalProps } from "@/context/modal-context-provider"
import { useModal } from "@/hooks/use-modal"

export function DeleteModal({ id, onConfirm, refetch, title, message }: ModalProps) {
    const { closeModal } = useModal()

    const handleDelete = async () => {
        try {
            await onConfirm?.(id)
            refetch?.()
            closeModal()
        } catch (error) {
            console.error("Error deleting project:", error)
        }
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {title ?? "Delete data"}
                </DialogTitle>
                <DialogDescription>
                    {message ??
                        "Are you sure you want to delete this data? This action cannot be undone and will permanently remove all associated information."}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
