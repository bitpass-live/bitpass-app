'use client';

import type React from 'react';

import { useState, useCallback, useMemo } from 'react';
import { PlusIcon, UserIcon, Trash2, UserSearch } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Role } from '@/types';

import { MOCK_ROLES } from '@/mock/data';

export function TeamManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactType, setContactType] = useState<'EMAIL' | 'NOSTR'>('EMAIL');
  const [email, setEmail] = useState('');
  const [pubkey, setPubkey] = useState('');

  const { toast } = useToast();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // TO-DO
    // Add Role

    toast({
      title: 'Miembro agregado',
      description: 'El miembro ha sido agregado exitosamente al equipo.',
    });

    setEmail('');
    setPubkey('');
    setDialogOpen(false);
  }, []);

  const handleRemoveRole = useCallback((pubkeyToRemove: string, roleType: string) => {
    // No permitir eliminar al OWNER
    if (roleType === 'OWNER') {
      toast({
        title: 'Acción no permitida',
        description: 'No se puede eliminar al creador del evento.',
        variant: 'destructive',
      });
      return;
    }

    // TO-DO
    // Remove Role

    toast({
      title: 'Miembro eliminado',
      description: 'El miembro ha sido eliminado exitosamente.',
    });
  }, []);

  const getRoleBadgeClass = useCallback((roleType: string) => {
    switch (roleType) {
      case 'OWNER':
        return 'bg-blue-100 text-blue-800';
      case 'MODERATOR':
        return 'bg-green-100 text-green-800';
      case 'CHECKIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Team Members</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className='h-4 w-4' />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form className='flex flex-col h-full' onSubmit={handleSubmit}>
              <DialogHeader>
                <UserSearch className='w-8 h-8 mb-4' />
                <DialogTitle>New Member</DialogTitle>
                <DialogDescription>Agrega un miembro para ayudar a gestionar tu evento.</DialogDescription>
              </DialogHeader>

              <DialogBody>
                <Tabs
                  defaultValue='EMAIL'
                  value={contactType}
                  onValueChange={(value) => setContactType(value as 'EMAIL' | 'NOSTR')}
                >
                  <TabsList className='grid w-full grid-cols-2 mb-4'>
                    <TabsTrigger value='EMAIL'>Email</TabsTrigger>
                    <TabsTrigger value='NOSTR'>Nostr</TabsTrigger>
                  </TabsList>

                  <TabsContent value='EMAIL'>
                    <Input
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='your@email.com'
                      type='email'
                      required
                    />
                  </TabsContent>

                  <TabsContent value='NOSTR'>
                    <Input
                      id='pubkey'
                      value={pubkey}
                      onChange={(e) => setPubkey(e.target.value)}
                      placeholder='your@lightning.address or npub...'
                      required
                    />
                  </TabsContent>
                </Tabs>
              </DialogBody>
              <DialogFooter>
                <Button className='w-full' type='submit'>
                  Send Invite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {MOCK_ROLES.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <img
            className='w-full max-w-64 -my-12 select-none pointer-events-none'
            alt='No team members yet'
            src='/no-members.png'
          />
          <h2 className='text-xl font-semibold mb-2'>No team members yet</h2>
          <p className='text-muted-foreground max-w-md mb-6'>Add team members to help manage your event.</p>
        </div>
      ) : (
        <Card className='overflow-hidden gap-[1px] bg-background'>
          {MOCK_ROLES.map((roleItem: Role) => (
            <div className='bg-card border-b last:border-none' key={roleItem.pubkey}>
              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3 w-full'>
                    <div className='rounded-full bg-muted p-2'>
                      <UserIcon className='h-5 w-5' />
                    </div>
                    <p className='font-medium'>{roleItem.pubkey.substring(0, 8)}...</p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='hidden md:flex'>
                      <Badge variant='secondary'>{roleItem.role === 'OWNER' ? 'Creador' : 'Moderador'}</Badge>
                    </div>
                    {roleItem.role !== 'OWNER' && (
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={() => handleRemoveRole(roleItem.pubkey, roleItem.role)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
