'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, ExternalLink } from 'lucide-react';

import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function MercadoPagoSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [mercadoPagoEmail, setMercadoPagoEmail] = useState('');
  const [mercadoPagoAlias, setMercadoPagoAlias] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // useEffect(() => {
  //   if (user?.mercadoPagoEmail) {
  //     setMercadoPagoEmail(user.mercadoPagoEmail);
  //   }
  //   if (user?.mercadoPagoAlias) {
  //     setMercadoPagoAlias(user.mercadoPagoAlias);
  //   }
  //   if (user?.mercadoPagoAccessToken) {
  //     setAccessToken(user.mercadoPagoAccessToken);
  //     setIsAdvancedMode(true);
  //   }
  //   if (user?.mercadoPagoTestMode) {
  //     setTestMode(user.mercadoPagoTestMode);
  //   }
  // }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación básica para el email
      if (mercadoPagoEmail && !mercadoPagoEmail.includes('@')) {
        toast({
          title: 'Email inválido',
          description: 'Por favor ingresa un email válido de MercadoPago',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Validación para el alias (solo alfanumérico y puntos)
      if (mercadoPagoAlias && !/^[a-zA-Z0-9.]+$/.test(mercadoPagoAlias)) {
        toast({
          title: 'Alias inválido',
          description: 'El alias de MercadoPago solo puede contener letras, números y puntos',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // await updateUser({
      //   mercadoPagoEmail,
      //   mercadoPagoAlias,
      //   mercadoPagoAccessToken: isAdvancedMode ? accessToken : undefined,
      //   mercadoPagoTestMode: testMode,
      // });

      toast({
        title: 'Configuración actualizada',
        description: 'Tu configuración de MercadoPago ha sido actualizada correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración de MercadoPago',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Configuración de MercadoPago</CardTitle>
        <CardDescription>Configura tu cuenta de MercadoPago para recibir pagos por tus eventos</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Alert className='bg-blue-900/20 border-blue-700/50 text-blue-200'>
          <CreditCard className='h-4 w-4' />
          <AlertTitle>Información importante</AlertTitle>
          <AlertDescription>
            Para recibir pagos a través de MercadoPago, necesitas proporcionar tu email o alias asociado a tu cuenta.
          </AlertDescription>
        </Alert>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='mercadopago-email'>Email de MercadoPago</Label>
            <Input
              id='mercadopago-email'
              value={mercadoPagoEmail}
              onChange={(e) => setMercadoPagoEmail(e.target.value)}
              placeholder='tu.email@ejemplo.com'
              className='bg-muted'
            />
            <p className='text-sm text-muted-foreground'>
              El email asociado a tu cuenta de MercadoPago donde recibirás los pagos
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='mercadopago-alias'>Alias de MercadoPago (opcional)</Label>
            <Input
              id='mercadopago-alias'
              value={mercadoPagoAlias}
              onChange={(e) => setMercadoPagoAlias(e.target.value)}
              placeholder='tu.alias.mercadopago'
              className='bg-muted'
            />
            <p className='text-sm text-muted-foreground'>
              Tu alias de MercadoPago (CVU) para recibir pagos más fácilmente
            </p>
          </div>

          <div className='flex items-center justify-between pt-2'>
            <div className='space-y-0.5'>
              <Label htmlFor='test-mode'>Modo de pruebas</Label>
              <p className='text-sm text-muted-foreground'>
                Utiliza el entorno de pruebas de MercadoPago (no se realizarán cobros reales)
              </p>
            </div>
            <Switch id='test-mode' checked={testMode} onCheckedChange={setTestMode} />
          </div>

          <div className='flex items-center justify-between pt-2'>
            <div className='space-y-0.5'>
              <Label htmlFor='advanced-mode'>Modo avanzado</Label>
              <p className='text-sm text-muted-foreground'>
                Configuración para integración avanzada con la API de MercadoPago
              </p>
            </div>
            <Switch id='advanced-mode' checked={isAdvancedMode} onCheckedChange={setIsAdvancedMode} />
          </div>

          {isAdvancedMode && (
            <div className='space-y-4 pt-4 border-t border-border-gray'>
              <div className='space-y-2'>
                <Label htmlFor='access-token'>Access Token</Label>
                <Input
                  id='access-token'
                  type='password'
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder='APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
                  className='bg-muted font-mono text-xs'
                />
                <div className='flex justify-between items-center'>
                  <p className='text-sm text-muted-foreground'>Token de acceso para la API de MercadoPago</p>
                  <Button variant='link' size='sm' className='h-auto p-0' asChild>
                    <Link
                      href='https://www.mercadopago.com.ar/developers/panel/app'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Obtener credenciales <ExternalLink className='ml-1 h-3 w-3' />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </CardFooter>
    </form>
  );
}
