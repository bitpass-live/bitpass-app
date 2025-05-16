'use client';

import type React from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface OptionMenu {
  id: string;
  text: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface MenuOptionsProps {
  id?: string;
  title?: string;
  options: OptionMenu[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuOptions({ title = 'Opciones', options, open, onOpenChange, id }: MenuOptionsProps) {
  return (
    <div className='container'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='bottom' className='max-h-[80vh] pb-12'>
          <SheetHeader className='flex flex-row items-center justify-between mb-4'>
            <SheetTitle>{title}</SheetTitle>
            <Button className='!mt-0' variant='secondary' size='icon' onClick={() => onOpenChange(false)}>
              <X className='h-5 w-5' />
              <span className='sr-only'>Cerrar</span>
            </Button>
          </SheetHeader>
          <div className='grid gap-3'>
            {options?.map((option: OptionMenu) => (
              <Button
                key={option.id}
                variant={option.variant || 'outline'}
                className='w-full'
                onClick={() => {
                  option.action();
                  onOpenChange(false);
                }}
              >
                <div className='flex items-center gap-3'>
                  <span>{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
