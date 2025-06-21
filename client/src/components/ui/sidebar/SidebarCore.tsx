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

    return null
  }
)
Sidebar.displayName = "Sidebar"