import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // 蓝色按钮 - 默认操作
        default: "bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white active:bg-blue-700",
        // 蓝色边框透明按钮 - 次要操作，悬停显示蓝色
        outline:
          "border border-gray-300 bg-transparent hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 active:bg-blue-200",
        // 灰色按钮 - 示例数据/加载示例
        secondary:
          "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 active:bg-blue-200",
        // 透明按钮 - 幽灵按钮
        ghost:
          "bg-transparent hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200",
        // 红色按钮 - 危险操作/清空
        destructive:
          "bg-red-100 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white active:bg-red-700",
        // 黄色按钮 - 警告操作
        warning:
          "bg-yellow-100 border border-yellow-200 text-yellow-700 hover:bg-yellow-600 hover:text-white active:bg-yellow-700",
        // 绿色按钮 - 成功/复制结果
        success:
          "bg-green-100 border border-green-200 text-green-500 hover:bg-green-500 hover:text-white active:bg-green-600",
        // 蓝色信息按钮
        info:
          "bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white active:bg-blue-700",
        // 链接样式
        link: "text-primary underline-offset-4 hover:underline hover:bg-primary/10 active:bg-primary/20",
        // Tab 标签样式 - 选中时蓝色背景，未选中时灰色背景悬停变蓝
        tab: "bg-secondary text-secondary-foreground hover:bg-primary/10 data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        "input-match": "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
