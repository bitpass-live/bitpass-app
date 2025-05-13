'use client';

import { useState } from 'react';

import { EventStep } from '@/components/onboarding/event-step';
import { TicketsStep } from '@/components/onboarding/tickets-step';
import { PaymentsStep } from '@/components/onboarding/payments-step';
import { SummaryStep } from '@/components/onboarding/summary-step';
import { DraftEventProvider } from '@/lib/draft-event-context';
import { INSTANCE_ID } from '@/lib/instance-id';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleFinish = () => {
    window.location.href = '/dashboard';
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

  return <DraftEventProvider instanceId={INSTANCE_ID}>
    {renderStep()}
  </DraftEventProvider>
}
