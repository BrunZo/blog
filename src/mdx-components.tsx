import React from 'react';
import type { MDXComponents } from 'mdx/types'
 
const components: MDXComponents = {
  h1: (props) => <h1 className='text-4xl font-bold mt-4' {...props} />,
  h2: (props) => <h2 className='text-3xl font-bold mt-3' {...props} />,
  h3: (props) => <h3 className='text-xl font-semibold mt-2' {...props} />,
  h4: (props) => <h4 className='text-lg font-semibold mt-2' {...props} />,
  p: (props) => <p className='mb-2' {...props} />,
  ul: (props) => <ul className='list-disc ml-8 mb-0' {...props} />,
  ol: (props) => <ol className='list-decimal ml-8 mb-0' {...props} />,
  li: (props) => <li className='mb-0' {...props} />,
  a: (props) => <a className='text-gray-500 hover:text-gray-800' {...props} />,
  img: (props) => <img className='mb-2' {...props} />,
}
 
export function useMDXComponents(): MDXComponents {
  return components
}