import Link from "next/link";
import React from "react";

function NiceLink({text, href}: {text: string, href: string}) {
  return (      
    <Link
      href={href}
      className='text-md text-gray-500 hover:text-gray-800'>
        {text}
    </Link>
  );
};

export default function Page() {
  return (
    <div className='text-gray-800'>
      <h1 className='font-bold text-3xl mt-2'>thoughts</h1>
      I'm primarily interested in personal development and life designing. 
      My main goal is to find a mathematical way to model the quality of life and a way to optimize it.

      <h2 className='font-bold text-xl mt-2'>personal development</h2>
      <p>Let's call <b>personal development</b> all the techniques or technology used to measure and enhance one's quality of life.</p>
      <p>Quality of life optimization can be done multi-scale:</p>
      <ul className='list-disc list-inside ml-4 space-y-1'>
        <li>day-to-day QoL optimization = daily productivity</li>
        <li>lifelong QoL optimization = life designing</li>
      </ul>
      <p>There are many similarities between day-to-day productivity and more life designing, namely, 
        both gave the goal of maximizing the <b>return of time invested</b>.</p>
      <small>Note: I feel "productivity" is not the right word here, but I cannot come up with a better one. 
        The core idea is being able to use one's time as efficiently as possible to get the greatest return possible from it.
        It's not constrained to work productivity.</small>

      <p>Many productivity authors provide both the principles they follow and their methods at the same time. 
        I prefer to treat both problems separately, namely, we need to devise</p>
      <ul className='list-disc list-inside ml-4 space-y-1'>
        <li><b><NiceLink text="a theoretical framework" href="notes/principles"/></b></li>
        <li>a practical implementation</li>
      </ul>
      <p>It's probably easier to tackle specific areas of life optimization. Some areas are:</p>
      <ul className='list-disc list-inside ml-4 space-y-1'>
        <li>time management</li>
        <li>personal info/knowledge management</li>
        <li>health, finances, etc.</li>
      </ul>
      <p>You can start reading the principles: <b><NiceLink text="here" href="notes/principles"/></b>.</p>
      <h2 className='font-bold text-xl mt-2'>philosophical discussions</h2>
      Some theoretical discussions I've had:
      <ul className='list-disc list-inside ml-4 space-y-1'>
        <li><NiceLink text="about death" href="notes/about_death"/></li>
        <li><NiceLink text="mind space" href="notes/mind_space"/></li>
      </ul>
    </div>
  );
}
