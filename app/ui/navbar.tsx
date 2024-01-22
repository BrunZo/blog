'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const links = [
  {'name': 'inicio', 'href': '/'},
  {'name': 'sobre mí', 'href': '/about-me'},
  {'name': 'notas', 'href': '/notes'}
]

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className='relative flex justify-center bg-gray-100 '>
      <div className='flex items-center justify-between w-full h-12 md:w-5/6'>
        <div className='flex items-center'>
          {links.map((link) => {
            const styles = clsx('flex items-center px-4 h-12', {
              'bg-gray-300': pathname === link.href,
              'hover:bg-gray-200': pathname !== link.href
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
          <NavbarLink href='/login' text='login'/>
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