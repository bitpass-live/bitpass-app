"use client"

import type React from "react"

import { SearchIcon, FilterIcon, QrCodeIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  reference: string
  setReference: (value: string) => void
  onSubmit: () => void
  onStartCamera: () => void
  isProcessing?: boolean
}

export function SearchBar({ reference, setReference, onSubmit, onStartCamera, isProcessing }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="mb-8 w-full container">
      <div className="relative flex gap-1 w-full md:max-w-md mx-auto">
        <div className="absolute -inset-[2px] bg-fluorescent-yellow rounded-xl opacity-100"></div>
        <form onSubmit={handleSubmit} className="relative w-full">
          {/* Main search container */}
          <div className="relative flex items-center w-full bg-background rounded-xl shadow-2xl border border-border overflow-hidden p-1">
            {/* Search icon */}
            <div className="pl-4">
              <SearchIcon className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Input field */}
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Reference code..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg text-foreground placeholder:text-muted-foreground py-6 px-3"
            />

            {/* Filter button */}
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-lg mr-0.5 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <FilterIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>

        <div className="relative flex items-center bg-background rounded-xl shadow-2xl border border-border overflow-hidden p-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-12 w-12 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={onStartCamera}
            disabled={isProcessing}
          >
            <QrCodeIcon className="h-5 w-5" />
            <span className="sr-only">Escanear QR</span>
          </Button>
        </div>
      </div>

      {/* Subtle instruction text */}
      <p className="text-xs text-center mt-3 text-muted-foreground">Enter ticket reference code or scan QR code</p>
    </div>
  )
}
