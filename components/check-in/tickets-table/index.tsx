'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketRow } from './ticket-row';
import { TicketModal } from '../ticket-modal';
import { MOCK_SALES } from '@/mock/data';

export function TicketsTable() {
  const sales = MOCK_SALES;

  const [filter, setFilter] = useState<'all' | 'checked-in' | 'not-checked-in'>('not-checked-in');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Aplicar filtros correctamente
  const filteredSales = sales.filter((sale) => {
    if (filter === 'all') return true;
    if (filter === 'checked-in') return sale.checkIn;
    if (filter === 'not-checked-in') return !sale.checkIn && sale.status === 'paid';
    return true;
  });

  // Calcular el total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));

  // Asegurarse de que la página actual es válida cuando cambian los filtros
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filter, totalPages]);

  // Obtener solo los tickets para la página actual
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Contador de tickets por categoría
  const checkedInCount = sales.filter((s) => s.checkIn).length;
  const notCheckedInCount = sales.filter((s) => !s.checkIn && s.status === 'paid').length;
  const allCount = sales.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowFilters(false);
    };

    // Solo añadir el listener si el menú está abierto
    if (showFilters) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Función para cambiar el filtro
  const handleFilterChange = (newFilter: 'all' | 'checked-in' | 'not-checked-in') => {
    setFilter(newFilter);
    setShowFilters(false);
    setCurrentPage(1); // Volver a la primera página al cambiar el filtro
    setSelectedTicket(null);
  };

  // Funciones para la paginación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar un subconjunto de páginas centrado en la página actual
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
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
            <span>{filter === 'all' ? 'All tickets' : filter === 'checked-in' ? 'Checked in' : 'Not checked in'}</span>
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
                <button
                  type='button'
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex justify-between items-center ${
                    filter === 'all' ? 'bg-primary text-background' : 'text-foreground hover:bg-muted transition-colors'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('all');
                  }}
                >
                  <span>All tickets</span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      filter === 'all' ? 'bg-background text-primary' : 'bg-muted'
                    }`}
                  >
                    {allCount}
                  </span>
                </button>
                <button
                  type='button'
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex justify-between items-center mt-1 ${
                    filter === 'checked-in'
                      ? 'bg-primary text-background'
                      : 'text-foreground hover:bg-muted transition-colors'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('checked-in');
                  }}
                >
                  <span>Checked in</span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      filter === 'checked-in' ? 'bg-background text-primary' : 'bg-muted'
                    }`}
                  >
                    {checkedInCount}
                  </span>
                </button>
                <button
                  type='button'
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex justify-between items-center mt-1 ${
                    filter === 'not-checked-in'
                      ? 'bg-primary text-background'
                      : 'text-foreground hover:bg-muted transition-colors'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('not-checked-in');
                  }}
                >
                  <span>Not checked in</span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      filter === 'not-checked-in' ? 'bg-background text-primary' : 'bg-muted'
                    }`}
                  >
                    {notCheckedInCount}
                  </span>
                </button>
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
                paginatedSales.map((sale) => <TicketRow key={sale.id} sale={sale} onSelectTicket={setSelectedTicket} />)
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Controles de paginación */}
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
              className={`p-1.5 rounded-md ${
                currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground hover:bg-muted'
              }`}
              aria-label='Previous page'
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === page ? 'bg-primary text-background' : 'text-foreground hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md ${
                currentPage === totalPages
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

      {/* Renderizar el modal fuera de la estructura de la tabla */}
      {selectedTicket && <TicketModal sale={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </>
  );
}
