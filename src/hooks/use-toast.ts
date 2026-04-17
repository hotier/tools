import { toast } from "sonner"

export function useToast() {
  return {
    toast: {
      error: (message: string) => {
        toast(message, {
          className: "bg-red-100 border border-red-200 text-red-600",
          style: {
            background: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626"
          }
        })
      },
      success: (message: string) => {
        toast(message, {
          className: "bg-green-100 border border-green-200 text-green-600",
          style: {
            background: "#f0fdf4",
            borderColor: "#bbf7d0",
            color: "#16a34a"
          }
        })
      },
      info: (message: string) => {
        toast(message, {
          className: "bg-blue-100 border border-blue-200 text-blue-600",
          style: {
            background: "#eff6ff",
            borderColor: "#bfdbfe",
            color: "#2563eb"
          }
        })
      }
    }
  }
}