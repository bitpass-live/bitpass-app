'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';;
import { useAuth } from '@/lib/auth-provider';
import { NostrPrivateKeyForm } from './nostr-private-key-form';
import { Zap, Key } from 'lucide-react';

export function NostrLoginForm() {
  const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { loginWithNostrExtension } = useAuth();

  const handleConnectExtension = async () => {
    setIsConnecting(true);

    try {
      await loginWithNostrExtension();

      toast({
        title: 'Connected successfully',
        description: 'Your Nostr extension has been connected',
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Could not connect to Nostr extension',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (showPrivateKeyForm) {
    return <NostrPrivateKeyForm onBack={() => setShowPrivateKeyForm(false)} />;
  }

  return (
    <div className='space-y-4 mt-4'>
      <Button onClick={handleConnectExtension} className='w-full' disabled={isConnecting}>
        <Zap className='h-4 w-4' />
        {isConnecting ? 'Connecting...' : 'Connect with Alby Extension'}
      </Button>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-card px-2 text-muted-foreground'>Or</span>
        </div>
      </div>

      <Button variant='outline' onClick={() => setShowPrivateKeyForm(true)} className='w-full'>
        <Key className='h-4 w-4' />
        Use Nostr Private Key
      </Button>
    </div>
  );
}
