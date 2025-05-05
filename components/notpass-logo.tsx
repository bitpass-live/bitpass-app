import { cn } from "@/lib/utils"

interface NotPassLogoProps {
  className?: string
}

export function NotPassLogo({ className }: NotPassLogoProps) {
  return (
    <div className={cn("font-bold text-white flex items-center", className)}>
      <span className="mr-0.5">🎫</span>BitPass
    </div>
  )
}
