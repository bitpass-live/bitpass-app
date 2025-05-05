'use client';

import { Checkin } from '@/components/check-in';

export default function CheckinPageRoute() {
  return (
    <div className='container pt-40'>
      <h1 className='text-2xl font-bold mb-6 text-center mx-auto'>Check-in de Tickets</h1>
      <Checkin />
    </div>
  );
}

export { Checkin };
