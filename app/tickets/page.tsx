'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { useDraftEventContext } from '@/lib/draft-event-context';
import type { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';
import { toast } from '@/components/ui/use-toast';

import { Header } from '@/components/dashboard/header';
import { LoaderView } from '@/components/loader-view';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';

export default function MyTicketsPage() {
  const { draftEvent, getTickets } = useDraftEventContext();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!draftEvent?.id) return;

    getTickets()
      .then(setTickets)
      .catch((err) => console.error('Error fetching tickets:', err))
      .finally(() => setLoading(false));
  }, [draftEvent?.id]);

  const handleCopy = () => {
    if (!selectedTicket) return;
    navigator.clipboard.writeText(selectedTicket.id).then(() => {
      toast({
        title: 'Copied',
        description: 'Ticket ID copied to clipboard',
      });
    });
  };

  if (loading) return <LoaderView />;

  return (
    <>
      <Header backGoHome={true} />

      <div className='w-full max-w-md space-y-6 mx-auto'>
        <div className='mt-6 px-4 text-center'>
          <h1 className='text-2xl md:text-3xl font-bold'>Your tickets</h1>
        </div>

        {!tickets.length ? (
          <div className='mb-6 text-center'>
            <p className='text-muted-foreground'>You have no tickets yet.</p>
          </div>
        ) : (
          <>
            <div className='text-center'>
              <p className='text-muted-foreground mb-4'>
                Here are your available tickets for this event.
              </p>
            </div>

            <div className='w-full space-y-4 mb-6'>
              {tickets.map((ticket, index) => (
                <Card key={ticket.id} className='bg-[#151515] border-border-gray'>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-center text-sm mb-2'>
                      <span className='text-muted-foreground'>Ticket ID #{index + 1}:</span>
                      <span className='text-white font-medium break-all text-right'>{ticket.id}</span>
                    </div>
                    <div className='pt-2 flex justify-center'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        View QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* QR Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket QR</DialogTitle>
            <DialogDescription>Scan this QR code to verify your ticket.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            {selectedTicket && (
              <div className='flex flex-col items-center gap-4'>
                <div className='bg-white p-4 rounded-lg mb-4'>
                  <QRCodeSVG value={selectedTicket.id} size={180} />
                </div>
                <div className='flex items-center gap-2'>
                  <code className='text-sm break-all'>{selectedTicket.id}</code>
                  <Button variant='ghost' size='icon' onClick={handleCopy}>
                    <Copy className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button className='w-full' onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
