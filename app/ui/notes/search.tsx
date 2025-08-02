'use client';

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function Search() { 
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const search_article =  useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term)
      params.set('query', term);
    else
      params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='flex flex-col'>
      <input
        className='border border-gray-300 rounded p-2 mt-4'
        type='text'
        placeholder='search keywords'
        onChange={(e) => { search_article(e.target.value) }}
        defaultValue={searchParams.get('query')?.toString()}>
      </input>
    </div>
  );
}
