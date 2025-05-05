"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

interface OTPVerificationFormProps {
  email: string
  onSuccess: () => void
  onBack: () => void
}

export function OTPVerificationForm({ email, onSuccess, onBack }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { toast } = useToast()

  // Set up countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.split("").slice(0, 6)
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit
    })

    setOtp(newOtp)

    // Focus the input after the last pasted digit
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus()
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTimeLeft(120) // Reset timer
    setIsLoading(false)

    toast({
      title: "OTP resent",
      description: "A new verification code has been sent to your email",
    })
  }

  const handleVerify = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits of the verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // For demo purposes, any 6-digit code works
    // In a real app, you would verify this with your backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    onSuccess()
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-sm font-medium">Verify your email</h3>
          <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp-input">Verification Code</Label>
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-12 text-center text-lg"
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {timeLeft > 0 ? <>Code expires in {formatTime(timeLeft)}</> : <>Code expired</>}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={handleResendOTP}
          disabled={isLoading || timeLeft > 0}
          className="p-0 h-auto"
        >
          Resend code
        </Button>
      </div>

      <Button onClick={handleVerify} className="w-full" disabled={isLoading || otp.some((digit) => !digit)}>
        {isLoading ? "Verifying..." : "Verify and Sign In"}
      </Button>
    </div>
  )
}
