import createMDX from "@next/mdx";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'] ,
};

const withMDX = createMDX({
  options: {
    providerImportSource: undefined, // this fucking line took me at least 1 h of debugging
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
});

export default withMDX(nextConfig);
