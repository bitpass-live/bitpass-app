'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { PlusIcon, Pencil, Trash2, Tag } from 'lucide-react';

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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { DiscountCode } from '@/types';
import { MOCK_DISCOUNTS_CODES, MOCK_EVENT } from '@/mock/data';

export function DiscountCodeManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [active, setActive] = useState(true);

  const { toast } = useToast();

  // Get event data and discount codes from store
  const event = MOCK_EVENT;
  const discountCodes = MOCK_DISCOUNTS_CODES;

  const handleOpenDialog = useCallback(() => {
    setEditingCode(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setValue('');
    setMaxUses('');
    setActive(true);

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
              <PlusIcon className='mr-2 h-4 w-4' />
              Crear Código
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[550px]'>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCode ? 'Editar Código de Descuento' : 'Crear Código de Descuento'}</DialogTitle>
                <DialogDescription>
                  {editingCode
                    ? 'Modifica los detalles del código de descuento'
                    : 'Define un nuevo código de descuento para este evento'}
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='code'>Código</Label>
                  <Input
                    id='code'
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder='Ej: EARLYBIRD'
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='value'>
                      {discountType === 'PERCENTAGE' ? 'Porcentaje de Descuento' : 'Monto de Descuento'}
                    </Label>
                    <Input
                      id='value'
                      type='number'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={discountType === 'PERCENTAGE' ? 'Ej: 20' : 'Ej: 1500'}
                      min='0'
                      max={discountType === 'PERCENTAGE' ? '100' : undefined}
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='maxUses'>Límite de Usos (opcional)</Label>
                    <Input
                      id='maxUses'
                      type='number'
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder='Vacío para uso ilimitado'
                      min='1'
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className='w-full' type='submit'>
                  {editingCode ? 'Guardar Cambios' : 'Crear Código'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discountCodes.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-muted p-3 mb-4'>
              <Tag className='h-10 w-10 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No hay códigos de descuento</h3>
            <p className='text-muted-foreground max-w-md mb-6'>
              Crea códigos de descuento para ofrecer promociones especiales a tus asistentes.
            </p>
            <Button onClick={() => handleOpenDialog()}>Crear tu Primer Código</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Descuento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map((discountCode) => {
                  const isActive = discountCode.active;

                  return (
                    <TableRow key={discountCode.id}>
                      <TableCell className='font-medium'>{discountCode.code}</TableCell>
                      <TableCell>{discountCode.discountType === 'PERCENTAGE' ? 'Porcentaje' : 'Monto Fijo'}</TableCell>
                      <TableCell>
                        {discountCode.discountType === 'PERCENTAGE'
                          ? `${discountCode.value}%`
                          : `$${discountCode.value}`}
                      </TableCell>
                      <TableCell>
                        {discountCode.used}
                        {discountCode.maxUses ? ` / ${discountCode.maxUses}` : ''}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          <Switch
                            checked={discountCode.active}
                            onCheckedChange={(checked) => handleToggleActive(discountCode.id, !checked)}
                            className='mr-2'
                          />
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='outline' size='icon' onClick={() => handleOpenDialog()} title='Editar'>
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleDeleteCode(discountCode.id)}
                            title='Eliminar'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
