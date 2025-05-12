'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { PlusIcon, Pencil, Trash2, Tag, Percent, EllipsisVertical, BadgePercent, TicketPercent } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/empty-state';
import { MenuOptions } from '@/components/menu-options';

import type { DiscountCode } from '@/types';
import { MOCK_DISCOUNTS_CODES, MOCK_EVENT } from '@/mock/data';

export function DiscountCodeManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [active, setActive] = useState(true);

  // Submenu
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const { toast } = useToast();

  // Get event data and discount codes from store
  const event = MOCK_EVENT;
  const discountCodes = MOCK_DISCOUNTS_CODES;

  const handleOpenDialog = useCallback((discountCode?: DiscountCode) => {
    if (discountCode) {
      setEditingCode(discountCode);
      setCode(discountCode.code);
      setValue(discountCode.value.toString());
      setMaxUses(discountCode.maxUses ? discountCode.maxUses.toString() : '');
      setActive(discountCode.active);
    } else {
      setEditingCode(null);
      setCode('');
      setValue('');
      setMaxUses('');
      setActive(true);
    }
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (editingCode) {
      // TO-DO
      // Update DiscountCode
      toast({
        title: 'Código actualizado',
        description: 'El código de descuento ha sido actualizado correctamente',
      });
    } else {
      // TO-DO
      // Add DiscountCode
      toast({
        title: 'Código creado',
        description: 'El código de descuento ha sido creado correctamente',
      });
    }

    setDialogOpen(false);
  }, []);

  const handleDeleteCode = useCallback((id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este código de descuento?')) {
      // TO-DO
      // Delete DiscountCode
      toast({
        title: 'Código eliminado',
        description: 'El código de descuento ha sido eliminado correctamente',
      });
    }
  }, []);

  const handleToggleActive = useCallback((id: string, currentActive: boolean) => {
    // TO-DO
    // Update DiscountCode
    toast({
      title: currentActive ? 'Código desactivado' : 'Código activado',
      description: `El código de descuento ha sido ${currentActive ? 'desactivado' : 'activado'} correctamente`,
    });
  }, []);

  const handleOpenMenu = (id: string) => {
    setSelectedCode(id);
    setOpenMenu(true);
  };

  const getOpcionesMenu = () => {
    if (!selectedCode) return [];

    const currentCode = discountCodes.find((code) => code.id === selectedCode);
    if (!currentCode) return [];

    return [
      {
        id: 'edit',
        text: 'Edit',
        action: () => handleOpenDialog(currentCode),
        variant: 'outline' as const,
      },
      {
        id: 'toggle',
        text: currentCode.active ? 'Disable' : 'Active',
        action: () => handleToggleActive(currentCode.id, currentCode.active),
        variant: currentCode.active ? 'outline' : 'secondary',
      },
      {
        id: 'delete',
        text: 'Delete',
        action: () => handleDeleteCode(currentCode.id),
        variant: 'destructive' as const,
      },
    ];
  };

  // Show loading state if event not found
  if (!event) {
    return <div className='p-8 text-center'>Cargando datos del evento...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Códigos de Descuento</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusIcon className='h-4 w-4' />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form className='flex flex-col h-full' onSubmit={handleSubmit}>
              <DialogHeader>
                <BadgePercent className='w-8 h-8 mb-4' />
                <DialogTitle>{editingCode ? 'Editar Código de Descuento' : 'New Discount Code'}</DialogTitle>
                <DialogDescription>
                  {editingCode
                    ? 'Modifica los detalles del código de descuento'
                    : 'Define un nuevo código de descuento para este evento'}
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div>
                  <Input
                    id='code'
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder='Ej: EARLYBIRD'
                    required
                  />
                </div>

                <div className='flex gap-4'>
                  <div className='flex h-10 w-full max-w-36'>
                    <Input
                      className='rounded-r-none text-end'
                      id='value'
                      type='number'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={'Discount'}
                      min='0'
                      required
                    />
                    <div className='flex items-center justify-center h-full px-3 bg-border rounded-r-md border border-r-0 border-input'>
                      <Percent className='w-4 h-4 text-muted-foreground' />
                    </div>
                  </div>
                  <Input
                    id='maxUses'
                    type='number'
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder='Unlimited quota'
                    min='1'
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button className='w-full' type='submit'>
                  {editingCode ? 'Save' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discountCodes.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <EmptyState className='-my-12' icon={TicketPercent} size={240} />
          <h2 className='text-xl font-semibold mb-2'>There are no discount codes</h2>
          <p className='text-muted-foreground max-w-md mb-6'>
            Create discount codes to offer special promotions to your attendees.
          </p>
        </div>
      ) : (
        <Card className='overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-4'></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Disc.</TableHead>
                <TableHead className='hidden md:table-cell'>Uses</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountCodes.map((discountCode: DiscountCode) => {
                const isActive = discountCode.active;

                return (
                  <TableRow key={discountCode.id}>
                    <TableCell className='w-4'>
                      <div
                        className={`w-4 h-4 rounded-full ${discountCode?.active ? 'bg-primary' : 'bg-gray-600'}`}
                      ></div>
                    </TableCell>
                    <TableCell className='font-medium'>{discountCode.code}</TableCell>
                    <TableCell>{`${discountCode.value}%`}</TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {discountCode.used}
                      {discountCode.maxUses ? ` / ${discountCode.maxUses}` : ''}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button variant='secondary' size='icon' onClick={() => handleOpenMenu(discountCode?.id)}>
                          <EllipsisVertical className='w-4 h-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <MenuOptions
        id={selectedCode || undefined}
        // TO-DO
        // Change by Discount Code for reference
        title='[Change to Code]'
        options={getOpcionesMenu()}
        open={openMenu}
        onOpenChange={setOpenMenu}
      />
    </div>
  );
}
