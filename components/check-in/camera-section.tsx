"use client"

import { CameraIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraSectionProps {
  onStartCamera: () => void
  isProcessing?: boolean
}

export function CameraSection({ onStartCamera, onSimulateScan, isProcessing = false }: CameraSectionProps) {
  return (
    <div className="flex justify-end mb-6">
      <Button
        onClick={onStartCamera}
        variant="outline"
        size="sm"
        className="bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        disabled={isProcessing}
      >
        <CameraIcon className="h-4 w-4 mr-2" />
      </Button>
    </div>
  )
}
