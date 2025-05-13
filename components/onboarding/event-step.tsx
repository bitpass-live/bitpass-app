'use client';

import { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';
import { useToast } from '@/hooks/use-toast';;

import { useDraftEventContext } from '@/lib/draft-event-context';
import { getErrorMessage } from '@/lib/utils';

interface EventStepProps {
  onNext: () => void;
}

export function EventStep({ onNext }: EventStepProps) {
  const {
    draftEvent,
    loading,
    setDraftField,
    saveDraftEvent,
    createDraftEvent,
  } = useDraftEventContext();

  const { toast } = useToast();

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(formattedDate);
  const [startTime, setStartTime] = useState(formattedTime);
  const [endDate, setEndDate] = useState(formattedDate);
  const [endTime, setEndTime] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draftEvent) return;

    setTitle(draftEvent.title ?? '');
    setDescription(draftEvent.description ?? '');
    setLocation(draftEvent.location ?? '');

    const starts = new Date(draftEvent.startsAt);
    const ends = new Date(draftEvent.endsAt);

    setStartDate(starts.toISOString().split('T')[0]);
    setStartTime(starts.toTimeString().slice(0, 5));
    setEndDate(ends.toISOString().split('T')[0]);
    setEndTime(ends.toTimeString().slice(0, 5));
  }, [draftEvent]);

  const handleNext = async () => {
    setIsSubmitting(true);

    try {
      if (!draftEvent) {
        await createDraftEvent({
          title,
          description,
          location,
          startDate,
          startTime,
          endDate,
          endTime,
        });
      } else {
        setDraftField('title', title);
        setDraftField('description', description);
        setDraftField('location', location);
        await saveDraftEvent();
      }

      onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Input
            type='text'
            id='eventName'
            placeholder='eg: Bitcoin Conference 2026'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id='description'
            rows={3}
            placeholder='Describe your event...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className='flex items-center gap-4 w-full'>
            <div className='w-full'>
              <Label htmlFor='startDate'>Start</Label>
            </div>
            <Input className='max-w-28' type='date' id='startDate' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input className='max-w-24' type='time' id='startTime' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <div className='flex items-center gap-4 w-full'>
            <div className='w-full'>
              <Label htmlFor='endDate'>End</Label>
            </div>
            <Input className='max-w-28' type='date' id='endDate' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Input className='max-w-24' type='time' id='endTime' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <Input
            type='text'
            id='location'
            placeholder='eg: La Crypta, Buenos Aires, Argentina'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <StepNavigation
          isFirstStep={true}
          onNext={handleNext}
          nextLabel={isSubmitting ? 'Saving...' : 'Next'}
          disabled={loading}
        />
      </div>
    </OnboardingLayout>
  );
}
