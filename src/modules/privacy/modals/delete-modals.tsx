/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable complexity */
/* eslint-disable max-lines */
"use client"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import { AxiosError } from "axios"
import { toast } from "sonner"

export function DeletePrivacyModal({ data, onConfirm, refetch }: any) {
    const { closeModal } = useModal()

    const handleDelete = async () => {
        try {
            await onConfirm?.(data?._id)
            refetch?.()
            closeModal()
        }catch (error: unknown) {
            const errorMessage =
              error instanceof AxiosError
                ? error.response?.data?.message || error.message
                : error instanceof Error
                ? error.message
                : String(error);
          
            toast.error(`Error deleting Privacy: ${errorMessage}`);
          }
          
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete Privacy</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete <strong>{data?.name}</strong>? This action cannot be undone and will
                    permanently remove all Privacy data.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete Privacy
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
