'use client';

import { useState } from 'react';
import { Banknote, Zap } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';

interface PaymentsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentsStep({ onNext, onBack }: PaymentsStepProps) {
  const [lightning, setLightning] = useState('');

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
          {/* Content */}
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
              defaultValue={lightning}
              onChange={(e) => setLightning(e.target.value)}
            />

            <Button variant={lightning ? 'default' : 'secondary'} disabled={!lightning}>
              Verify
            </Button>
          </CardContent>
        </Card>

        <StepNavigation onNext={onNext} onBack={onBack} nextLabel='Next' />
      </div>
    </OnboardingLayout>
  );
}
