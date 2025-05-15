'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketRow } from './ticket-row';
import { TicketModal } from '../ticket-modal';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';

export function TicketsTable() {
  const { draftEvent } = useDraftEventContext();
  const { bitpassAPI } = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'checked-in' | 'not-checked-in'>('not-checked-in');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadTickets = async () => {
      if (!draftEvent?.id) return;

      try {
        const ticketTypes = await bitpassAPI.getAdminTickets(draftEvent.id);
        const allTickets = ticketTypes.flatMap((type: any) =>
          type.tickets.map((ticket: any) => ({
            ...ticket,
            ticketTypeName: type.name,
            checkIn: ticket.isCheckedIn,
            status: 'PAID',
          }))
        );
        setTickets(allTickets);
      } catch (err) {
        console.error('Error loading tickets:', err);
      }
    };

    loadTickets();
  }, [draftEvent, bitpassAPI]);

  const filteredSales = useMemo(() => {
    return tickets.filter((sale) => {
      if (filter === 'all') return true;
      if (filter === 'checked-in') return sale.checkIn;
      if (filter === 'not-checked-in') return !sale.checkIn && sale.status === 'paid';
      return true;
    });
  }, [tickets, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const checkedInCount = tickets.filter((s) => s.checkIn).length;
  const notCheckedInCount = tickets.filter((s) => !s.checkIn && s.status === 'paid').length;
  const allCount = tickets.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filter, totalPages]);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setShowFilters(false);
    setCurrentPage(1);
    setSelectedTicket(null);
  };

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (page: number) => page >= 1 && page <= totalPages && setCurrentPage(page);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <div className='flex justify-between items-center w-full mb-4'>
        <h2 className='text-xl font-semibold text-foreground'>Tickets</h2>
        <div className='relative'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters(!showFilters);
            }}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground text-sm hover:bg-muted transition-colors'
          >
            <span>
              {filter === 'all' ? 'All tickets' : filter === 'checked-in' ? 'Checked in' : 'Not checked in'}
            </span>
            <span className='flex items-center justify-center w-5 h-5 rounded-full bg-primary text-background text-xs font-medium'>
              {filter === 'all' ? allCount : filter === 'checked-in' ? checkedInCount : notCheckedInCount}
            </span>
          </button>

          {showFilters && (
            <div
              className='absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-border bg-background shadow-xl overflow-hidden'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-1.5 bg-background'>
                {(['all', 'checked-in', 'not-checked-in'] as const).map((f) => (
                  <button
                    key={f}
                    type='button'
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex justify-between items-center ${filter === f ? 'bg-primary text-background' : 'text-foreground hover:bg-muted transition-colors'
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFilterChange(f);
                    }}
                  >
                    <span>
                      {f === 'all' ? 'All tickets' : f === 'checked-in' ? 'Checked in' : 'Not checked in'}
                    </span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${filter === f ? 'bg-background text-primary' : 'bg-muted'
                        }`}
                    >
                      {f === 'all' ? allCount : f === 'checked-in' ? checkedInCount : notCheckedInCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='rounded-md border border-border overflow-hidden w-full'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-full'>Reference</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className='text-center py-4 text-muted-foreground'>
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSales.map((sale) => (
                  <TicketRow key={sale.id} sale={sale} onSelectTicket={setSelectedTicket} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredSales.length > 0 && (
        <div className='flex items-center justify-between mt-4 text-sm'>
          <div className='text-muted-foreground'>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredSales.length)} of {filteredSales.length} tickets
          </div>

          <div className='flex items-center space-x-1'>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md ${currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground hover:bg-muted'
                }`}
              aria-label='Previous page'
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === page ? 'bg-primary text-background' : 'text-foreground hover:bg-muted'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md ${currentPage === totalPages
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-muted'
                }`}
              aria-label='Next page'
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {selectedTicket && <TicketModal sale={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </>
  );
}
