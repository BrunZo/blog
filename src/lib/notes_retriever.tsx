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
  const baseDir = path.join(process.cwd(), '/src/content');
  const notesCount = fs.readdirSync(baseDir)
                        .filter((file) => file.endsWith('.mdx'))
                        .length
  return Math.ceil(notesCount / CARDS_BY_PAGE);
}

export async function fetchFilteredNotes({
  query,
  tags,
  page
}: {
  query?: string,
  tags?: string[],
  page?: string
}) {
  const sliceStart = (Number(page || '1') - 1) * CARDS_BY_PAGE;
  const sliceEnd = Number(page || '1') * CARDS_BY_PAGE;
  const baseDir = path.join(process.cwd(), '/src/content');
  const paths = fs.readdirSync(baseDir)
                      .filter((file) => file.endsWith('.mdx'))
                      .slice(sliceStart, sliceEnd);
  return paths.map(path => path.replace(/\.mdx$/, ''));
}
