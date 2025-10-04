import Link from "next/link";

export default function HomePage() {
  const links = [
  ];

  return (
    <div className='text-gray-800'>
      <h1 className='font-bold text-3xl mt-2'>home page</h1>
      <p className='mt-3'>
        You can find a short introduction of myself in the&nbsp;
        <Link
          href='/about-me'
          className='text-md text-gray-500 hover:text-gray-800'>
            about me section
        </Link>.
      </p>
      <p>
        Please, don't take anything here too seriously, I'll just post whatever is on my mind.
      </p>
      
      { /*
      <h2 className='font-bold text-xl mt-4'>Últimas publicaciones</h2>
      <p>Últimas publicaciones</p>
         */ }
      
      <h2 className='font-bold text-xl mt-4'>working on...</h2>
      <table className='border-separate border-spacing-x-2'>
        <tbody>
          {links.map((link) => (
            <tr key={link.name}>
              <td>
                <Link
                  href={link.href} 
                  className='text-md text-gray-500 hover:text-gray-800'>
                    {link.name}
                </Link>
              </td>
              <td>
                {link.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
