'use client';

import type { ReactNode } from 'react';

import { ProgressBar } from './progress-bar';
import { Header } from '../dashboard/header';
import { LucideIcon } from 'lucide-react';
import { EmptyState } from '../empty-state';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  icon: Icon,
}: OnboardingLayoutProps) {
  return (
    <>
      <Header />
      <section>
        <div className='container max-w-md'>
          <div className='flex flex-col gap-8 py-8'>
            <div className='flex flex-col items-center'>
              <EmptyState className='-my-12' icon={Icon} size={240} />
              <h1 className='text-3xl font-semibold text-foreground text-center'>{title}</h1>
              <p className='text-muted-foreground text-center'>{subtitle}</p>
            </div>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div>{children}</div>

          <div className='text-center text-xs text-muted-foreground mt-6'>BitPass • Powered by Bitcoin & Nostr</div>
        </div>
      </section>
    </>
  );
}
