"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X } from "lucide-react"
import Image from "next/image"

import { cn, getUrlImage } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: File | string | null
    onChange?: (value: File | null, preview?: string | null) => void
    onBlur?: () => void
    disabled?: boolean
    maxSize?: number
    accept?: Record<string, string[]>
    previewOnly?: boolean
}

export function FileUpload({
    value,
    onChange,
    onBlur,
    disabled,
    maxSize = 5,
    accept = {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    previewOnly = false,
    className,
    ...props
}: FileUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!value) {
            setPreview(null)
            return
        }

        if (typeof value === "string") {
            setPreview(value)
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value)
            setPreview(objectUrl)

            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [value])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        maxSize: maxSize * 1024 * 1024,
        disabled: disabled || previewOnly,
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                const rejectionErrors = rejectedFiles[0].errors.map((err) => {
                    if (err.code === "file-too-large") {
                        return `File is too large. Max size is ${maxSize}MB.`
                    }
                    if (err.code === "file-invalid-type") {
                        return "Invalid file type. Please upload an image."
                    }
                    return err.message
                })
                setError(rejectionErrors.join(" "))
                return
            }

            if (acceptedFiles.length > 0) {
                try {
                    const file = acceptedFiles[0]
                    const objectUrl = URL.createObjectURL(file)
                    setPreview(objectUrl)
                    onChange?.(file, objectUrl)
                    setError(null)
                } catch (err) {
                    setError("Error processing file. Please try again.")
                }
            }
        },
    })

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
        onChange?.(null, null)
    }


    return (
        <div className={cn("space-y-2", className)} {...props}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background p-4 text-center transition-colors hover:bg-muted/50",
                    isDragActive && "border-primary bg-muted/50",
                    (disabled || previewOnly) && "cursor-not-allowed opacity-60",
                    className,
                )}
            >
                <input {...getInputProps()} onBlur={onBlur} />

                {preview ? (
                    <div className="relative h-full w-full">
                        <Image
                            src={getUrlImage(preview)}
                            alt="Preview"
                            width={300}
                            height={150}
                            className="max-w-full max-h-[150px] object-contain object-center rounded-md"
                            onError={() => {
                                setError("Failed to load image preview")
                            }}
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                        {!disabled && !previewOnly && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 h-6 w-6"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <UploadCloud className="h-10 w-10" />
                        <div className="text-sm font-medium">
                            <span className="text-primary">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs">SVG, PNG, JPG or GIF (max. {maxSize}MB)</div>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}
