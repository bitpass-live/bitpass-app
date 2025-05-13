'use client';

import { useState } from 'react';
import { useBitpassStore } from '@/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, MoreVertical, CheckIcon, Copy, Mail, RefreshCw, UserRoundX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';;

export function TicketsTable() {
  const { toast } = useToast();
  const sales = useBitpassStore((state) => state.sales);
  const checkInTicket = useBitpassStore((state) => state.checkInTicket);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Filter only paid tickets
  const paidTickets = sales.filter((sale) => sale.status === 'paid');

  const handleCheckIn = (reference: string) => {
    setIsLoading(reference);

    // Simulate API call
    setTimeout(() => {
      const success = checkInTicket(reference);

      if (success) {
        toast({
          title: 'Check-in successful',
          description: `Ticket ${reference} has been checked in.`,
        });
      } else {
        toast({
          title: 'Check-in failed',
          description: 'This ticket has already been checked in.',
          variant: 'destructive',
        });
      }

      setIsLoading(null);
    }, 600);
  };

  const handleCopyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    toast({
      title: 'Reference copied',
      description: 'Ticket reference has been copied to clipboard.',
    });
  };

  const handleSendEmail = (email: string) => {
    toast({
      title: 'Email action',
      description: `Action for ${email} would be triggered here.`,
    });
  };

  const handleRevokeTicket = (reference: string) => {
    toast({
      title: 'Revoke ticket',
      description: `Ticket ${reference} would be revoked here.`,
      variant: 'destructive',
    });
  };

  return (
    <div className='rounded-lg border border-gray-700 bg-black/40 backdrop-blur-sm overflow-hidden'>
      <div className='p-4 border-b border-gray-700 flex justify-between items-center'>
        <h3 className='text-lg font-medium text-white'>Sold Tickets</h3>
        <Badge variant='outline' className='text-gray-400 border-gray-700'>
          {paidTickets.length} tickets
        </Badge>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-gray-700 hover:bg-transparent'>
              <TableHead className='text-gray-400'>Buyer</TableHead>
              <TableHead className='text-gray-400'>Reference</TableHead>
              <TableHead className='text-gray-400'>Status</TableHead>
              <TableHead className='text-gray-400 text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidTickets.length === 0 ? (
              <TableRow className='border-gray-700 hover:bg-gray-900/30'>
                <TableCell colSpan={4} className='text-center text-gray-500 py-8'>
                  No tickets sold yet
                </TableCell>
              </TableRow>
            ) : (
              paidTickets.map((ticket) => (
                <TableRow key={ticket.reference} className='border-gray-700 hover:bg-gray-900/30'>
                  <TableCell className='font-medium text-gray-300'>{ticket.buyer}</TableCell>
                  <TableCell className='font-mono text-sm text-gray-400'>{ticket.reference}</TableCell>
                  <TableCell>
                    {ticket.checkIn ? (
                      <div className='flex items-center gap-1.5'>
                        <CheckCircle2 className='h-4 w-4 text-green-500' />
                        <span className='text-green-500'>Checked in</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1.5'>
                        <XCircle className='h-4 w-4 text-gray-500' />
                        <span className='text-gray-500'>Not checked in</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    {!ticket.checkIn && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='mr-2 text-green-500 hover:text-green-400 hover:bg-green-500/10'
                        onClick={() => handleCheckIn(ticket.reference)}
                        disabled={isLoading === ticket.reference}
                      >
                        {isLoading === ticket.reference ? (
                          <RefreshCw className='h-4 w-4 animate-spin' />
                        ) : (
                          <CheckIcon className='h-4 w-4' />
                        )}
                        <span className='ml-1'>Check in</span>
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='text-gray-400 hover:text-white'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='bg-gray-900 border-gray-700 text-gray-300'>
                        <DropdownMenuLabel>Ticket Options</DropdownMenuLabel>
                        <DropdownMenuSeparator className='bg-gray-700' />
                        <DropdownMenuItem
                          className='hover:bg-gray-800 cursor-pointer'
                          onClick={() => handleCopyReference(ticket.reference)}
                        >
                          <Copy className='h-4 w-4 mr-2' />
                          Copy Reference
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='hover:bg-gray-800 cursor-pointer'
                          onClick={() => handleSendEmail(ticket.buyer)}
                        >
                          <Mail className='h-4 w-4 mr-2' />
                          Contact Buyer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='bg-gray-700' />
                        <DropdownMenuItem
                          className='text-red-500 hover:bg-red-950 hover:text-red-400 cursor-pointer'
                          onClick={() => handleRevokeTicket(ticket.reference)}
                        >
                          <UserRoundX className='h-4 w-4 mr-2' />
                          Revoke Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
