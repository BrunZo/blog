import Link from "next/link";

function NiceLink({text, href}: {text: string, href: string}) {
  return (      
    <Link
      href={href}
      className='text-md text-gray-500 hover:text-gray-800'>
        {text}
    </Link>
  );
};

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
      <h3 className='font-semibold text-lg'>math</h3>
      <p>I have some notes from the math lessons I took:</p>
      <ul className='list-disc list-inside ml-4 space-y-1'>
        <li><NiceLink text="topology" href="notes/topology"/></li>
        <li><NiceLink text="algebra" href="notes/algebra"/></li>
      </ul>
      <p>Also, I'm creating a website to read all notes I've written to train students for math olympiads:&nbsp;
        <NiceLink text="servilleta" href="https://servilleta.vercel.app"/>.</p>
      <h3 className='font-semibold text-lg'>phi</h3>
      <p>I like writing all sort of wrong reasonings. You can read them&nbsp;
        <NiceLink text="here" href="phi"/>.</p>
      <h3 className='font-semibold text-lg'>finance</h3>
      <p>I'm also reading Luenberger's Investment Science and uploading notes & implementation&nbsp;
        <NiceLink text="here" href="https://github.com/BrunZo/finance"/>.</p>
    </div>
  );
}
