import Link from "next/link";

export default function HomePage() {
  const links = [
    {
      'name': 'página personal', 
      'href': 'https://brunoziger.vercel.app/',
      'description': 'mi página de presentación.'
    },
    {
      'name': 'dictale', 
      'href': 'https://dictale.vercel.app/',
      'description': 'un juego con el diccionario.'
    },
    {
      'name': 'servilleta', 
      'href': 'https://servilleta.vercel.app/',
      'description': 'problemas & formato para apuntes.'
    },
    {
      'name': 'arg-official', 
      'href': 'https://arg-official.vercel.app/',
      'description': 'recopilación de datos de olímpicos & olimpiadas.'
    },
  ];

  return (
    <div className='text-gray-800'>
      <h1 className='font-bold text-3xl mt-2'>Inicio</h1>
      <p>Bienvenidos a mi página personal.</p>
      <p>
        Podrás encontrar una pequeña introducción a mi persona en la pestaña&nbsp;
        <Link
          href='/about-me'
          className='text-md text-gray-500 hover:text-gray-800'>
            sobre mí
        </Link>.
      </p>
      <p className='mt-4'>
        Algunas aclaraciones antes de que sigas navegando por este sitio:
      </p>
      <ul className='list-disc pl-8'>
        <li>
          Este sitio es meramente recreativo; para una presentación más formal de mi persona, podés visitar&nbsp;
          <Link
            href='https://brunoziger.vercel.app/'
            className='text-md text-gray-500 hover:text-gray-800'>
              mi página de presentación
          </Link>.
        </li>
        <li>
          Prefiero el modo claro, siempre, por lo que el sitio esta exclusivamente diseñado a tal fin;
          si sos de los que no soporta nada que no sea modo oscuro, bueno, es momento de crecer.
        </li>
        <li>
          La principal atracción de este sitio es la sección&nbsp;
          <Link
            href='/notes'
            className='text-md text-gray-500 hover:text-gray-800'>
              notas
          </Link>; las notas no tienen ningún tema además de "lo que me pinte en el momento".
        </li>
      </ul>
      
      <h2 className='font-bold text-xl mt-4'>Últimas publicaciones</h2>
      <p>Últimas publicaciones</p>
      
      <h2 className='font-bold text-xl mt-4'>Otros proyectos míos</h2>
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