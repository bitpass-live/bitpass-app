"use client"

import type React from "react"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Loader } from "lucide-react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </Suspense>
  )
}

function SettingsLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  // This is a workaround to handle the tab parameter
  // In a real app, you would use a more robust solution
  useEffect(() => {
    if (tab) {
      const tabElement = document.querySelector(`[data-value="${tab}"]`) as HTMLButtonElement
      if (tabElement) {
        tabElement.click()
      }
    }
  }, [tab])

  return <>{children}</>
}
