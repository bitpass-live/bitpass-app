import type React from "react"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef, ElementType } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  className?: string
  color?: string
  speed?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  color = "#D8FF00",
  speed = "",
  children,
  ...rest
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"

  return (
    <Component className={cn("star-border-container", className)} {...rest}>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed+'ms',
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed+'ms',
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  )
}
