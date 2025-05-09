'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (user?.name) {
  //     setName(user.name);
  //   }
  // }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // await updateUser({ name });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Your name' />
        </div>

        <div className='space-y-2'>
          <Label>Email / Nostr</Label>
          <Input value={user?.email || user?.nostrPubKey || ''} disabled className='bg-muted' />
          <p className='text-sm text-muted-foreground'>
            This is your {user?.authMethod === 'email' ? 'email address' : 'Nostr public key'} used for login
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
