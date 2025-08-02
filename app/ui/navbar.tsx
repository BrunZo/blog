'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const links = [
  {'name': 'home', 'href': '/'},
  {'name': 'about me', 'href': '/about-me'},
  {'name': 'notes', 'href': '/notes'}
]

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className='relative flex justify-center '>
      <div className='flex items-center justify-between w-full h-12 md:w-5/6'>
        <div className='flex items-center'>
          {links.map((link) => {
            const styles = clsx('flex items-center px-4 h-12', {
              'underline': pathname === link.href,
              'hover:bg-gray-100': pathname !== link.href
            })
            return (
              <div key={link.name} className={styles}>
                <Link 
                  href={link.href}
                  className={'text-gray-800'}>
                    {link.name}
                </Link>
              </div>
            )
          })}
        </div>
        <div className=''>
        </div>
      </div>
    </nav>
  );
}

function NavbarLink({ href, text }: {
  href: string,
  text: string 
}) {
  return (
    <div className='flex items-center px-4 h-12 text-md text-gray-800 hover:bg-gray-200'>
      <Link href={href}>{text}</Link>
    </div>
  )
}
