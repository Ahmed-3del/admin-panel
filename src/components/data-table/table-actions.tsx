"use client"

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"

interface TableActionsProps {
    onView?: () => void
    onEdit?: () => void
    onDelete?: () => void
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
}

export function TableActions({
    onView,
    onEdit,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
}: TableActionsProps) {
    // Default to showing all actions if not specified
    const { t } = useTranslation()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {t("actions")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {showView && onView && (
                    <DropdownMenuItem onClick={onView}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("view_details")}
                    </DropdownMenuItem>
                )}
                {showEdit && onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("edit")}
                    </DropdownMenuItem>
                )}
                {showDelete && onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
