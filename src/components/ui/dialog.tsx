
"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog")
  }
  return context
}

function Dialog({
  open,
  onOpenChange,
  children,
  ...props
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
} & React.ComponentProps<"div">) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? onOpenChange || (() => { }) : setInternalOpen

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  children,
  asChild = false,
  ...props
}: {
  children: React.ReactNode
  asChild?: boolean
} & React.ComponentProps<"button">) {
  const { onOpenChange } = useDialog()

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    onOpenChange(true)
    props.onClick?.(e as React.MouseEvent<HTMLButtonElement, MouseEvent>)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<any>,
      {
        ...props,
        ...(typeof children.type === "string" && children.type === "button" ? { onClick: handleClick } : {}),
        "data-slot": "dialog-trigger",
      }
    )
  }

  return (
    <button data-slot="dialog-trigger" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

function DialogPortal({
  children,
  container,
  ...props
}: {
  children: React.ReactNode
  container?: Element | null
} & React.ComponentProps<"div">) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div data-slot="dialog-portal" {...props}>
      {children}
    </div>,
    container || document.body,
  )
}

function DialogClose({
  children,
  asChild = false,
  ...props
}: {
  children?: React.ReactNode
  asChild?: boolean
} & React.ComponentProps<"button">) {
  const { onOpenChange } = useDialog()

  const handleClick = (e: React.MouseEvent) => {
    onOpenChange(false)
    props.onClick?.(e as React.MouseEvent<HTMLButtonElement, MouseEvent>)
  }

  if (asChild && React.isValidElement(children)) {
    const childProps: any = {
      ...props,
      "data-slot": "dialog-close",
    }
    if (
      typeof children.type === "string" &&
      ["button", "a", "div"].includes(children.type)
    ) {
      childProps.onClick = handleClick
    }
    return React.cloneElement(children, childProps)
  }

  return (
    <button data-slot="dialog-close" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { onOpenChange } = useDialog()

  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      onClick={() => onOpenChange(false)}
      data-state="open"
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { open, onOpenChange } = useDialog()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (open && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0] as HTMLElement
      if (firstElement) {
        firstElement.focus()
      }
    }
  }, [open])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [open])

  if (!open) return null

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={contentRef}
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        data-state="open"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="dialog-title" className={cn("text-lg leading-none font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
