'use client';

import { CalendarPlus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';

interface EventStepProps {
  onNext: () => void;
}

export function EventStep({ onNext }: EventStepProps) {
  return (
    <OnboardingLayout
      currentStep={0}
      totalSteps={4}
      icon={CalendarPlus}
      title='Configure your Event'
      subtitle="Enter your event's basic information"
    >
      <div className='space-y-6'>
        <div className='flex flex-col gap-4'>
          <Input type='text' id='eventName' placeholder='eg: Bitcoin Conference 2026' />

          <Textarea id='description' rows={3} placeholder='Describe your event...'></Textarea>

          <div className='flex items-center gap-4 w-full'>
            <div className='w-full'>
              <Label htmlFor='startDate'>Start</Label>
            </div>
            <Input className='max-w-28' type='date' id='startDate' />
            <Input className='max-w-24' type='time' id='startTime' />
          </div>

          <div className='flex items-center gap-4 w-full'>
            <div className='w-full'>
              <Label htmlFor='endDate'>End</Label>
            </div>
            <Input className='max-w-28' type='date' id='endDate' />
            <Input className='max-w-24' type='time' id='endTime' />
          </div>
          <Input type='text' id='location' placeholder='eg: La Crypta, Buenos Aires, Argentina' />
        </div>

        <StepNavigation isFirstStep={true} onNext={onNext} nextLabel='Next' />
      </div>
    </OnboardingLayout>
  );
}
