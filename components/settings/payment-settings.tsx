'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';

import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/hooks/use-toast';;

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PaymentSettings() {
  const { bitpassAPI } = useAuth();
  const { paymentMethods } = useAuth();
  const { toast } = useToast();

  const lightning = paymentMethods.find((m) => m.type === 'LIGHTNING');
  const [lightningAddress, setLightningAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lightning?.lightningAddress) {
      setLightningAddress(lightning.lightningAddress);
    }
  }, [lightning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lightningAddress && !lightningAddress.includes('@')) {
      toast({
        title: 'Invalid Lightning Address',
        description: 'Please enter a valid Lightning Address (e.g., you@domain.com)',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!lightning || !lightning.lightningAddress) {
        await bitpassAPI.addLightningPaymentMethod(lightningAddress);
      } else {
        await bitpassAPI.updateLightningPaymentMethod(lightning.id, lightningAddress)
      }

      toast({
        title: 'Payment method saved',
        description: 'Your Lightning Address has been configured successfully.',
      });
    } catch (error: any) {
      const message =
        error.message?.includes('already exists') || error.message?.includes('unique')
          ? 'You already have a Lightning payment method configured.'
          : 'Failed to update payment settings. Please try again.';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>Configure how you receive payments for your events</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {!lightning?.lightningAddress && (
          <Alert className='bg-amber-900/20 border-amber-700/50 text-amber-200'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Lightning Address Required</AlertTitle>
            <AlertDescription>
              You need to set up a Lightning Address to receive payments for your event tickets.
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-2'>
          <Label htmlFor='lightning-address'>
            Lightning Address
            <span className='text-red-500 ml-1'>*</span>
          </Label>
          <div className='flex'>
            <div className='bg-muted rounded-l-md flex items-center px-3 border border-r-0 border-input'>
              <Zap className='h-4 w-4 text-muted-foreground' />
            </div>
            <Input
              id='lightning-address'
              value={lightningAddress}
              onChange={(e) => setLightningAddress(e.target.value)}
              placeholder='you@domain.com'
              className='rounded-l-none'
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Your Lightning Address is used to receive payments for event tickets
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </form>
  );
}
