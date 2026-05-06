import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  groupSize?: number; // 한 그룹에 표시할 페이지 수 (기본값 5)
}

export default function CommonPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  groupSize = 5,
}: PaginationProps) {
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // 현재 그룹 계산
  const currentGroup = Math.ceil(currentPage / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(currentGroup * groupSize, totalPages);

  console.log(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 버튼 (첫 그룹일 땐 숨김) */}
        {currentPage > 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={isFirstPage}
              className="bg-muted hover:bg-primary hover:cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </PaginationItem>
        )}

        {/* 페이지 번호 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          const isActive = currentPage === page;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => goToPage(page)}
                isActive={isActive}
                className={
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-white hover:cursor-pointer'
                    : 'bg-muted hover:cursor-pointer'
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* 다음 버튼 (마지막 그룹일 땐 숨김) */}
        {currentPage < totalPages && (
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={isLastPage}
              className="bg-muted hover:bg-primary"
            >
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
