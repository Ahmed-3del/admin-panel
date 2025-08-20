/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
"use client"

import * as React from "react"

import { ChevronDown, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "react-i18next"

export interface Column<T> {
    key: keyof T | string
    label: string
    sortable?: boolean
    searchable?: boolean
    render?: (value: any, row: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    searchKey?: keyof T
    searchPlaceholder?: string
    onAdd?: () => void
    addButtonText?: string
    showColumnToggle?: boolean
    itemsPerPage?: number
    loading?: boolean
    emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
    onAdd,
    addButtonText = "Add New",
    showColumnToggle = true,
    itemsPerPage = 10,
    loading = false,
    emptyMessage = "No data available",
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof T | string
        direction: "asc" | "desc"
    } | null>(null)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(
        columns.reduce((acc, col) => ({ ...acc, [col.key as string]: true }), {}),
    )
    const [pageSize, setPageSize] = React.useState(itemsPerPage)

    const filteredData = React.useMemo(() => {
        if (!searchTerm || !searchKey) return data

        return data.filter((item) => {
            const value = item[searchKey]
            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
    }, [data, searchTerm, searchKey])

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return filteredData

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        })
    }, [filteredData, sortConfig])

    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return sortedData?.slice(startIndex, startIndex + pageSize)
    }, [sortedData, currentPage, pageSize])

    const totalPages = Math.ceil(sortedData?.length / pageSize)

    const handleSort = (key: keyof T | string) => {
        const column = columns.find((col) => col.key === key)
        if (!column?.sortable) return

        setSortConfig((current) => {
            if (current?.key === key) {
                return current.direction === "asc" ? { key, direction: "desc" } : null
            }
            return { key, direction: "asc" }
        })
    }

    const toggleColumnVisibility = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }))
    }

    const visibleColumnsArray = columns.filter((col) => visibleColumns[col.key as string])
    const { t } = useTranslation()

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {searchKey && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 max-w-sm"
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-x-4 ">
                    {showColumnToggle && (
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {columns.map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.key as string}
                                        className="capitalize"
                                        checked={visibleColumns[column.key as string]}
                                        onCheckedChange={() => toggleColumnVisibility(column.key as string)}
                                    >
                                        {column.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {onAdd && (
                        <Button onClick={onAdd} className="ml-2" disabled={loading}>
                            <Plus className="mr-2 h-4 w-4" />
                            {addButtonText}
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumnsArray.map((column) => (
                                <TableHead
                                    key={column.key as string}
                                    className={`${column.className ?? ""} ${column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {column.sortable && sortConfig?.key === column.key && (
                                            <span className="text-xs">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumnsArray.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="text-muted-foreground">{t("loading")}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedData.length ? (
                            paginatedData.map((row, index) => (
                                <TableRow key={index}>
                                    {visibleColumnsArray.map((column) => (
                                        <TableCell key={column.key as string} className={column.className}>
                                            {column.render
                                                ? column.render(row[column.key as keyof T], row)
                                                : row[column.key as keyof T]?.toString() ?? "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={visibleColumnsArray.length} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                            {sortedData.length} entries
                        </p>
                        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNumber = i + 1
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
