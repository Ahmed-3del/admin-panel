"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Option = {
    label: string
    value: string
    id?: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    emptyMessage?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options",
    disabled = false,
    className,
    emptyMessage = "No options found.",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    const handleUnselect = React.useCallback(
        (value: string) => {
            onChange(selected.filter((item) => item !== value))
        },
        [selected, onChange],
    )

    const handleSelect = React.useCallback(
        (currentValue: string) => {
            if (selected.includes(currentValue)) {
                onChange(selected.filter((item) => item !== currentValue))
            } else {
                onChange([...selected, currentValue])
            }
        },
        [selected, onChange],
    )

    const selectedOptions = React.useMemo(() => {
        return options?.filter((option) => selected.includes(option.value)) || []
    }, [options, selected])

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    ref={triggerRef}
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={placeholder}
                    disabled={disabled}
                    className={cn(
                        "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className,
                    )}
                >
                    <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map((option) => (
                                <Badge key={option.value} variant="secondary" className="mr-1 mb-1 text-xs">
                                    {option.label}
                                    {!disabled && (
                                        <div
                                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted p-0.5"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleUnselect(option.value)
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove {option.label}</span>
                                        </div>
                                    )}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="p-0 max-h-60 overflow-y-auto"
                style={{ width: triggerRef.current?.offsetWidth || "auto" }}
                align="start"
                sideOffset={4}
            >
                {options?.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
                ) : (
                    options?.map((option) => {
                        const isSelected = selected.includes(option.value)
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    handleSelect(option.value)
                                }}
                                className="flex items-center justify-between cursor-pointer px-3 py-2"
                            >
                                <span className="flex-1 truncate">{option.label}</span>
                                {isSelected && <Check className="h-4 w-4 ml-2 flex-shrink-0" />}
                            </DropdownMenuItem>
                        )
                    })
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
