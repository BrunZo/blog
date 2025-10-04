'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from 'clsx';

export default function Pagination({ amountPages: totalPages }: {
  amountPages: number 
}) {
  const pathname = usePathname();
  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  }
  
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className='flex justify-center items-center mt-4'>
      <PaginationArrow
        direction='left'
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}/>
      {allPages.map((i) => {
        return (
          <PaginationButton
            key={i}
            page={String(i)}
            href={createPageURL(i)}
            isActive={i === currentPage}/>
        )
      })}
      <PaginationArrow
        direction='right'
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}/>
    </div>
  );
}

function PaginationArrow({ direction, href, isDisabled }: {
  direction: 'left' | 'right',
  href: string,
  isDisabled: boolean
}) {
  const styles = clsx(
    'hover:bg-gray-100 text-gray-800 py-2 px-4',
    {
      'disabled': isDisabled
    }
  )
  return isDisabled ? (
    <div className={styles}>
      {direction === 'left' ? '<' : '>'}
    </div>
  ) : (
    <>
      <Link
        href={href}
        className={styles}>
          {direction === 'left' ? '<' : '>'}
      </Link>
    </>
  )
}

function PaginationButton({ page, href, isActive }: {
  page: string,
  href: string,
  isActive: boolean
}) {
  const styles = clsx(
    'text-gray-800 py-2 px-4',
    {
      'underline': isActive
    }
  )
  return isActive || page === '...' ? (
    <div className={styles}> {page} </div>
  ) : (
    <>
      <Link
        href={href}
        className={styles}>
          {page}
      </Link>
    </>
  )
}

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (currentPage <= 3)
    return [1, 2, 3, '...', totalPages - 1, totalPages];

  if (currentPage >= totalPages - 2)
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
