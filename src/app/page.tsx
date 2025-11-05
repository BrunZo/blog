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
      <ul>
        <li><NiceLink text="topology" href="notes/topology"/></li>
        <li><NiceLink text="algebra" href="notes/algebra"/></li>
      </ul>
      <p>Also, I'm creating a website to read all notes I've written to train students for math olympiads:</p>
      <ul>
        <li><NiceLink text="servilleta" href="servilleta.vercel.app"/></li>
      </ul>
      <p className='text-sm'>This is very incomplete and low-priority right now, so it will be so for at least some months.</p>
      <h3 className='font-semibold text-lg'>phi</h3>
      <p>I like writing some thoughts I have, most of which are completely wrong. You can read some:</p>
      <ul>
        <li><NiceLink text="local-global phenomena in life designing" href="notes/global_local"/></li>
        <li><NiceLink text="thoughts on daydreaming" href="notes/why_daydreaming"/></li>
        <li><NiceLink text="the mind space" href="notes/mind_space"/></li>
      </ul>
      <p>All my other notes can be found&nbsp;      
        <Link 
          href="/notes"
          className='text-md text-gray-500 hover:text-gray-800'>
            here
        </Link>.
      </p>

      <h3 className='font-semibold text-lg'>other</h3>
    </div>
  );
}
