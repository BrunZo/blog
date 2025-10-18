import Link from "next/link";

export default function HomePage() {
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
      
      <h2 className='font-bold text-xl mt-4'>working on...</h2>
      <table className='border-separate border-spacing-x-4'>
        <tbody>
          <tr>
            <td>
              <a href='https://servilleta.vercel.app/' className='text-md text-gray-500 hover:text-gray-800'>Servilleta</a>
            </td>
            <td>A site for my math notes, currently in development.</td>
          </tr>
          <tr>
            <td>
              <a href='https://iberoofficial.vercel.app/' className='text-md text-gray-500 hover:text-gray-800'>ibero-official</a>
            </td>
            <td>Resultados históricos de la Olimpiada Iberoamericana de Matemática.</td>
          </tr>
          <tr>
            <td>
              <a href='/' className='text-md text-gray-500 hover:text-gray-800'>
                this
              </a>
            </td>
            <td>
              Look around.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
