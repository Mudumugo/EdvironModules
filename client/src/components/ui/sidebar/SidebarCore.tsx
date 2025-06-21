import * as React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SIDEBAR_WIDTH_MOBILE } from "./SidebarConstants"

const sidebarVariants = cva(
  "group peer hidden text-sidebar-foreground md:block",
  {
    variants: {
      variant: {
        default: "inset-y-0 left-0 z-20 flex h-full flex-col border-r",
        floating:
          "left-2 top-2 z-20 h-[calc(100vh-16px)] w-[calc(var(--sidebar-width)-16px)] rounded-lg border bg-sidebar shadow-lg",
        inset:
          "left-2 top-2 z-20 h-[calc(100vh-16px)] w-[calc(var(--sidebar-width)-16px)]",
        sidebar: "",
      },
      side: {
        left: "",
        right: "right-0",
      },
      collapsible: {
        icon: "",
        offcanvas: "",
        none: "",
      },
    },
    defaultVariants: {
      side: "left",
      variant: "default",
      collapsible: "offcanvas",
    },
  }
)

export interface SidebarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sidebarVariants> {
  side?: "left" | "right"
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "default",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-all duration-300 ease-in-out md:flex",
          "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar transition-all duration-300 ease-in-out group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow hover:shadow-lg"
        >
          {children}
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"