'use client';

import { useEffect, useState } from 'react';
import { Banknote, Zap } from 'lucide-react';

import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useDraftEventContext } from '@/lib/draft-event-context';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';
import { getErrorMessage } from '@/lib/utils';

interface PaymentsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentsStep({ onNext, onBack }: PaymentsStepProps) {
  const { bitpassAPI, paymentMethods, loadUserData } = useAuth();
  const { draftEvent } = useDraftEventContext();
  const { toast } = useToast();

  const lightning = paymentMethods.find((m) => m.type === 'LIGHTNING');
  const [lightningAddress, setLightningAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lightning?.lightningAddress) {
      setLightningAddress(lightning.lightningAddress);
    }
  }, [lightning]);

  const handleVerify = async () => {
    if (!lightningAddress.includes('@')) {
      toast({
        title: 'Invalid Lightning Address',
        description: 'Please enter a valid Lightning Address (e.g., you@domain.com)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let methodId: string;

      if (!lightning) {
        const newMethod = await bitpassAPI.addLightningPaymentMethod(lightningAddress);
        methodId = newMethod.id;
      } else {
        if (lightning.lightningAddress !== lightningAddress) {
          await bitpassAPI.updateLightningPaymentMethod(lightning.id, lightningAddress);
        }
        methodId = lightning.id;
      }

      if (draftEvent?.id) {
        await bitpassAPI.addPaymentMethodToEvent(draftEvent.id, methodId);
      }

      await loadUserData();

      toast({
        title: 'Lightning Address saved',
        description: 'Your Lightning Address has been configured and linked to the event.',
      });

      onNext();
    } catch (err) {
      toast({
        title: 'Error saving payment method',
        description: getErrorMessage(err, 'Failed to save payment method'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      icon={Banknote}
      title='Payment Methods'
      subtitle='Establish how you will receive payments for your tickets'
    >
      <div className='space-y-6'>
        <Card className='overflow-hidden'>
          <CardHeader className='flex flex-row justify-between items-center gap-4'>
            <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
              <div className='hidden md:flex justify-center items-center w-6 h-6'>
                <Zap className='w-4 h-4' />
              </div>
              <div>
                <h3 className='font-medium'>Lightning Network</h3>
                <p className='text-sm text-muted-foreground'>Receive instant payments in Bitcoin</p>
              </div>
            </div>
            <div className='relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full'>
              <Switch id='lightning-toggle' checked={true} disabled />
            </div>
          </CardHeader>

          <CardContent className='flex flex-col sm:flex-row gap-2 px-6 pt-4 pb-8 md:pb-4 border-t bg-card'>
            <Input
              type='text'
              id='lightningAddress'
              placeholder='you@lightning.address'
              value={lightningAddress}
              onChange={(e) => setLightningAddress(e.target.value)}
            />
            <Button
              variant={lightningAddress ? 'default' : 'secondary'}
              disabled={!lightningAddress || isSubmitting}
              onClick={handleVerify}
            >
              {isSubmitting ? 'Saving...' : 'Verify'}
            </Button>
          </CardContent>
        </Card>

        <StepNavigation onNext={handleVerify} onBack={onBack} nextLabel='Next' disabled={isSubmitting} />
      </div>
    </OnboardingLayout>
  );
}
