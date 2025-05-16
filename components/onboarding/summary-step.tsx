'use client';

import { useMemo } from 'react';
import { Check, Copy } from 'lucide-react';

import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';

interface SummaryStepProps {
  onFinish: () => void;
  onBack: () => void;
}

export function SummaryStep({ onFinish, onBack }: SummaryStepProps) {
  const { draftEvent } = useDraftEventContext();
  const { paymentMethods, bitpassAPI } = useAuth();
  const { toast } = useToast();

  const lightningAddress = paymentMethods.find((m) => m.type === 'LIGHTNING')?.lightningAddress;
  const MOCK_DOMAIN_DEPLOY = 'domain-deploy.com';

  const formattedDate = useMemo(() => {
    if (!draftEvent?.startsAt) return '';
    const date = new Date(draftEvent.startsAt);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [draftEvent?.startsAt]);

  const handleFinish = async () => {
    try {
      if (!draftEvent?.id) throw new Error('Missing event ID');
      if (!draftEvent.ticketTypes?.length) throw new Error('You must create at least one ticket');
      if (!lightningAddress) throw new Error('Lightning address not configured');

      await bitpassAPI.publishEvent(draftEvent.id);
      onFinish();
    } catch (err) {
      toast({
        title: 'Error publishing event',
        description: getErrorMessage(err, 'Failed to publish event'),
        variant: 'destructive',
      });
    }
  };

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
            <p className='text-muted-foreground'>{formattedDate}</p>
            <h3 className='text-xl font-semibold'>{draftEvent?.title || 'Untitled Event'}</h3>

            <div className='mt-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Lightning Address:</span>
                <span>{lightningAddress || 'Not configured'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Ticket types:</span>
                <span>{draftEvent?.ticketTypes?.length ?? 0}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Team members:</span>
                <span>{draftEvent?.team?.length ?? 1}</span>
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
              <code>{MOCK_DOMAIN_DEPLOY}</code>
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
              <code>{MOCK_DOMAIN_DEPLOY}/admin</code>
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
              <code>{MOCK_DOMAIN_DEPLOY}/checkin</code>
            </div>
            <div className='flex items-center space-x-2'>
              <Button size='icon' variant='secondary'>
                <Copy />
              </Button>
            </div>
          </Card>
        </div>

        <StepNavigation onNext={handleFinish} onBack={onBack} isLastStep={true} />
      </div>
    </OnboardingLayout>
  );
}
