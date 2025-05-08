'use client';

import type React from 'react';

import { useState, useCallback, useMemo } from 'react';
import { PlusIcon, UserIcon, Trash2 } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
              <PlusIcon className='mr-2 h-4 w-4' />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Agregar Miembro</DialogTitle>
                <DialogDescription>Agrega un miembro para ayudar a gestionar tu evento.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <Tabs
                  defaultValue='EMAIL'
                  value={contactType}
                  onValueChange={(value) => setContactType(value as 'EMAIL' | 'NOSTR')}
                >
                  <TabsList className='grid w-full grid-cols-2 mb-4'>
                    <TabsTrigger value='EMAIL'>Email</TabsTrigger>
                    <TabsTrigger value='NOSTR'>Nostr / Lightning</TabsTrigger>
                  </TabsList>

                  <TabsContent value='EMAIL' className='space-y-4 mt-0 p-0'>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='correo@ejemplo.com'
                        type='email'
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value='NOSTR' className='space-y-4 mt-0 p-0'>
                    <div className='grid gap-2'>
                      <Label htmlFor='pubkey'>Bitcoin Pubkey / Lightning Address</Label>
                      <Input
                        id='pubkey'
                        value={pubkey}
                        onChange={(e) => setPubkey(e.target.value)}
                        placeholder='npub1... o usuario@lightning.address'
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button type='submit'>Agregar Miembro</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {MOCK_ROLES.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-muted p-3 mb-4'>
              <UserIcon className='h-10 w-10 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No team members yet</h3>
            <p className='text-muted-foreground max-w-md mb-6'>Add team members to help manage your event.</p>
            <Button onClick={() => setDialogOpen(true)}>Add Your First Team Member</Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {MOCK_ROLES.map((roleItem) => (
            <Card key={roleItem.pubkey}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-full bg-muted p-2'>
                      <UserIcon className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium'>{roleItem.pubkey.substring(0, 8)}...</p>
                      <div
                        className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getRoleBadgeClass(
                          roleItem.role,
                        )}`}
                      >
                        {roleItem.role === 'OWNER' ? 'Creador' : 'Moderador'}
                      </div>
                    </div>
                  </div>
                  {roleItem.role !== 'OWNER' && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveRole(roleItem.pubkey, roleItem.role)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
