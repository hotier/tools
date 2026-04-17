"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast w-fit max-w-[90vw] px-4 py-3 rounded-lg bg-background text-foreground border border-border shadow-lg flex flex-row items-center gap-2",
          description: "text-muted-foreground mt-1",
          actionButton: "bg-primary text-primary-foreground ml-2",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }