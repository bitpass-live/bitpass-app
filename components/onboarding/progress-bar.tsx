import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className='relative w-full max-w-xs mx-auto'>
      <div className='relative z-10 flex justify-between mb-2'>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              index < currentStep
                ? 'bg-primary text-background'
                : index === currentStep
                ? 'bg-primary text-background'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < currentStep ? <Check className='w-3 h-3' /> : index + 1}
          </div>
        ))}
      </div>
      <div className='absolute top-0 z-0 flex items-center w-full h-6'>
        <div className='w-full bg-muted h-1 rounded-full'>
          <div
            className='bg-primary h-1 rounded-full transition-all duration-300'
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
