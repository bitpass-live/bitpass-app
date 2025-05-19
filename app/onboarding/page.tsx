'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDraftEventContext } from '@/lib/draft-event-context';

import { EventStep } from '@/components/onboarding/event-step';
import { TicketsStep } from '@/components/onboarding/tickets-step';
import { PaymentsStep } from '@/components/onboarding/payments-step';
import { SummaryStep } from '@/components/onboarding/summary-step';

export default function OnboardingPage() {
  const router = useRouter();
  const { draftEvent } = useDraftEventContext();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (draftEvent && draftEvent?.id && draftEvent?.status !== 'DRAFT') {
      router.push('/');
    }
  }, [draftEvent]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleFinish = () => {
    window.location.href = '/';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EventStep onNext={handleNext} />;
      case 1:
        return <TicketsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PaymentsStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SummaryStep onFinish={handleFinish} onBack={handleBack} />;
      default:
        return <EventStep onNext={handleNext} />;
    }
  };

  return renderStep();
}
