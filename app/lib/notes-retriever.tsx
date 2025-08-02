import fs from 'fs';
import path from 'path';

export const CARDS_BY_PAGE = 6;

export async function fetchAmountPages({
  query,
  tags,
}: {
  query?: string,
  tags?: string[],
}) {
  const baseDir = path.join(process.cwd(), 'app/content');
  const notesCount = fs.readdirSync(baseDir)
                        .filter((file) => file.endsWith('.mdx'))
                        .length
  return Math.ceil(notesCount / CARDS_BY_PAGE);
}

export async function fetchFilteredArticles({
  query,
  tags,
  page='1'
}: {
  query?: string,
  tags?: string[],
  page: string
}) {
  const baseDir = path.join(process.cwd(), 'app/content');
  const paths = fs.readdirSync(baseDir)
                    .filter((file) => file.endsWith('.mdx'))
                    .slice((Number(page) - 1) * CARDS_BY_PAGE, Number(page) * CARDS_BY_PAGE);
  return paths.map(path => path.replace(/\.mdx$/, ''));
}
