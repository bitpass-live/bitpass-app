'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';;
import { useAuth } from '@/lib/auth-provider';
import { OTPVerificationForm } from './otp-verification-form';

export function EmailLoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { requestOTPCode } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await requestOTPCode(email);
      toast({ title: 'OTP sent', description: 'Check your email for the verification code' });
      setOtpSent(true);
    } catch (err: any) {
      toast({ title: 'Error sending OTP', description: err.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSent) {
    return (
      <OTPVerificationForm email={email} onSuccess={() => router.push('/dashboard')} onBack={() => setOtpSent(false)} />
    );
  }

  return (
    <form onSubmit={handleSendOTP} className='space-y-4 mt-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='you@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Sending verification code...' : 'Continue with Email'}
      </Button>
    </form>
  );
}
