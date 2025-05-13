'use client';

import { Check, Copy } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';

interface SummaryStepProps {
  onFinish: () => void;
  onBack: () => void;
  eventData?: {
    name: string;
    date: string;
    ticketTypes: number;
    paymentMethods: string[];
    teamMembers: number;
  };
}

export function SummaryStep({
  onFinish,
  onBack,
  eventData = {
    name: 'Mi Evento Bitcoin',
    date: '15 de Diciembre, 2023',
    ticketTypes: 2,
    paymentMethods: ['Lightning Network'],
    teamMembers: 1,
  },
}: SummaryStepProps) {
  const MOCK_DOMAIN_DEPLOY = 'domain-deploy.com';

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      icon={Check}
      title='Your Event Is Ready!'
      subtitle='Configuration Summary'
    >
      <div className='space-y-6'>
        <div className='bg-surface rounded-lg border border-border overflow-hidden'>
          <div className='p-4'>
            <p className='text-muted-foreground'>{eventData.date}</p>
            <h3 className='text-xl font-semibold'>{eventData.name}</h3>

            <div className='mt-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Lightning Address:</span>
                <span>{'test@lawallet.ar'}</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='flex flex-col gap-2'>
              <li className='flex items-center gap-2'>
                <div className='flex justify-center items-center w-6 h-6 text-primary'>
                  <Check className='w-4 h-4' />
                </div>
                <span>Share the Event URL</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='flex justify-center items-center w-6 h-6 text-gray-500'>
                  <Check className='w-4 h-4' />
                </div>
                <span>Add Team Members</span>
                <Badge variant='secondary'>Soon</Badge>
              </li>
              <li className='flex items-center gap-2'>
                <div className='flex justify-center items-center w-6 h-6 text-gray-500'>
                  <Check className='w-4 h-4' />
                </div>
                <span>Set Up Discount Codes</span>
                <Badge variant='secondary'>Soon</Badge>
              </li>
              <li className='flex items-center gap-2'>
                <div className='flex justify-center items-center w-6 h-6 text-gray-500'>
                  <Check className='w-4 h-4' />
                </div>
                <span>Customize the Ticket Sales Page</span>
                <Badge variant='secondary'>Soon</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className='space-y-3'>
          <h3 className='text-lg font-medium'>Important URLs</h3>

          <Card className='flex flex-row md:items-center justify-between p-3'>
            <div className='flex flex-col'>
              <span className='text-sm text-text-secondary'>Public URL of the event</span>
              <code className=''>{MOCK_DOMAIN_DEPLOY}</code>
            </div>
            <div className='flex items-center space-x-2'>
              <Button size='icon' variant='secondary'>
                <Copy />
              </Button>
            </div>
          </Card>

          <Card className='flex flex-row md:items-center justify-between p-3'>
            <div className='flex flex-col'>
              <span className='text-sm text-text-secondary'>Administration Panel</span>
              <code className=''>{MOCK_DOMAIN_DEPLOY}/admin</code>
            </div>
            <div className='flex items-center space-x-2'>
              <Button size='icon' variant='secondary'>
                <Copy />
              </Button>
            </div>
          </Card>

          <Card className='flex flex-row md:items-center justify-between p-3'>
            <div className='flex flex-col'>
              <span className='text-sm text-text-secondary'>Check-in interface</span>
              <code className=''>{MOCK_DOMAIN_DEPLOY}/checkin</code>
            </div>
            <div className='flex items-center space-x-2'>
              <Button size='icon' variant='secondary'>
                <Copy />
              </Button>
            </div>
          </Card>
        </div>

        <StepNavigation onNext={onFinish} onBack={onBack} isLastStep={true} />
      </div>
    </OnboardingLayout>
  );
}
