'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InlineLoginForm() {
  const { login, bitpassAPI } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    try {
      setLoading(true);
      await bitpassAPI.requestOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      toast({ title: 'Error requesting OTP', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const user = await bitpassAPI.verifyOtp(email, code);
      login(user, bitpassAPI.token!);
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <Label className='text-white'>Login with Email</Label>
      <Input
        placeholder='you@example.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='bg-[#1A1A1A] border-border-gray text-white'
        disabled={otpSent || loading}
      />
      {otpSent && (
        <Input
          placeholder='Enter code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='bg-[#1A1A1A] border-border-gray text-white'
        />
      )}
      <Button
        type='button'
        className='w-full'
        onClick={otpSent ? handleVerifyOtp : handleRequestOtp}
        disabled={loading || !email || (otpSent && !code)}
      >
        {loading ? 'Processing...' : otpSent ? 'Verify Code' : 'Send OTP'}
      </Button>
    </div>
  );
}
