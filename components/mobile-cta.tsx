'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button after scrolling down 300px
      const shouldBeVisible = window.scrollY > 300;
      if (shouldBeVisible !== visible) {
        setVisible(shouldBeVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-black/80 backdrop-blur-md border-t border-border-gray'>
      <Button
        className='w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray rounded-xl py-5 text-base font-medium'
        asChild
      >
        <Link href='#lead-form'>Solicitá acceso anticipado</Link>
      </Button>
    </div>
  );
}
