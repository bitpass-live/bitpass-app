// OTPVerificationForm.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';

interface OTPVerificationFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTPVerificationForm({ email, onSuccess, onBack }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const { requestOTPCode, verifyOTPCode } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^[0-9]+$/.test(pasted)) return;
    const digits = pasted.split('');
    const newOtp = [...otp];
    digits.forEach((d, i) => { if (i < newOtp.length) newOtp[i] = d; });
    setOtp(newOtp);
    const nextIndex = digits.length < newOtp.length ? digits.length : newOtp.length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await requestOTPCode(email);
      setTimeLeft(120);
      toast({ title: 'OTP resent', description: 'A new verification code has been sent to your email' });
    } catch (err: any) {
      toast({ title: 'Error resending OTP', description: err.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter all 6 digits of the verification code', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTPCode(email, code);
      onSuccess();
      toast({ title: 'Logged in', description: 'You have been successfully authenticated' });
    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.message || 'Please check the code and try again', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

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
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              ref={el => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-10 h-12 text-center text-lg"
              autoFocus={idx === 0}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
        </span>
        <Button variant="link" size="sm" onClick={handleResendOTP} disabled={isLoading || timeLeft > 0} className="p-0 h-auto">
          Resend code
        </Button>
      </div>

      <Button onClick={handleVerify} className="w-full" disabled={isLoading || otp.some(d => !d)}>
        {isLoading ? 'Verifying...' : 'Verify and Sign In'}
      </Button>
    </div>
  );
}