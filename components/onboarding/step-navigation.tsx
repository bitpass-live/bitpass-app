'use client';

import { Button } from '../ui/button';

interface StepNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isOptionalStep?: boolean;
  disabled?: boolean;
}

export function StepNavigation({
  onNext,
  onBack,
  onSkip,
  nextLabel = 'Next',
  backLabel = 'Back',
  skipLabel = 'Skip this step',
  isLastStep = false,
  isFirstStep = false,
  isOptionalStep = false,
  disabled = false
}: StepNavigationProps) {
  return (
    <div className={`flex ${isFirstStep ? 'justify-end' : 'justify-between'} gap-2 w-full`}>
      {!isFirstStep && onBack && (
        <Button className='w-full' variant='ghost' onClick={onBack}>
          {backLabel}
        </Button>
      )}
      <div className='flex items-center gap-2 w-full'>
        {isOptionalStep && onSkip && (
          <Button className='w-full' variant='outline' onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
        <Button className='w-full' variant={isLastStep ? 'default' : 'secondary'} onClick={onNext} disabled={disabled}>
          {isLastStep ? 'Create' : nextLabel}
        </Button>
      </div>
    </div>
  );
}
