import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showInfo = true,
  itemsPerPage = 12,
  totalItems = 0
}: PaginationProps) {
  // Calcular páginas visíveis
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas para mostrar de cada lado
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageInfo = () => {
    if (!showInfo || totalItems === 0) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return `${startItem}-${endItem} de ${totalItems}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Informações da página */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{getPageInfo()}</span>
          {totalPages > 1 && (
            <span className="ml-2">
              • Página {currentPage} de {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center space-x-1">
        {/* Botão Anterior */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                  isCurrentPage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-md'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                aria-label={`Página ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                <span className="text-sm font-medium">{pageNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Componente de paginação compacta para mobile
export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: Omit<PaginationProps, 'showInfo' | 'itemsPerPage' | 'totalItems'>) {
  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-3 w-3" />
      </button>

      <span className="text-sm text-gray-600 px-2">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
