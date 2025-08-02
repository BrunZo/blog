import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'] ,
};

const withMDX = createMDX({
  options: {
    providerImportSource: undefined, // this fucking line took me at least 1 h of debugging
    remarkPlugins: [['remark-math']],
    rehypePlugins: [['rehype-katex', { strict: true, throwOnError: true }]]
  },
});

export default withMDX(nextConfig);
