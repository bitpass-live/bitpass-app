'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-provider';
import { NostrPrivateKeyForm } from './nostr-private-key-form';
import { Zap, Key } from 'lucide-react';

export function NostrLoginForm() {
  const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleConnectExtension = async () => {
    setIsConnecting(true);

    try {
      // Simulate connecting to Alby or other extension
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful connection
      const mockPubkey = 'npub1random' + Math.random().toString(36).substring(2, 10);

      login({ pubkey: mockPubkey, role: 'OWNER' });
      router.push('/dashboard');

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

  const handlePrivateKeySuccess = (pubkey: string) => {
    login({ pubkey, role: 'OWNER' });
    router.push('/checkin');
    toast({
      title: 'Logged in successfully',
      description: 'Welcome to Bitpass!',
    });
  };

  if (showPrivateKeyForm) {
    return <NostrPrivateKeyForm onSuccess={handlePrivateKeySuccess} onBack={() => setShowPrivateKeyForm(false)} />;
  }

  return (
    <div className='space-y-4 mt-4'>
      <Button onClick={handleConnectExtension} className='w-full' disabled={isConnecting}>
        <Zap className='mr-2 h-4 w-4' />
        {isConnecting ? 'Connecting...' : 'Connect with Alby Extension'}
      </Button>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>

      <Button variant='outline' onClick={() => setShowPrivateKeyForm(true)} className='w-full'>
        <Key className='mr-2 h-4 w-4' />
        Use Nostr Private Key
      </Button>
    </div>
  );
}
