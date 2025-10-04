import fs from 'fs';
import path from 'path';

export const CARDS_BY_PAGE = 6;

// Helper function to read and parse MDX file content
async function readMdxFile(notePath: string) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', notePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Get mdx exports using next dynamic imports
    const { title, date, abstract, tags } = await import(`@/content/${notePath}`);
    
    return {
      title: title || '',
      date: date || new Date(),
      abstract: abstract || '',
      tags: tags || [],
      content: content
    };
  } catch (error) {
    console.error(`Error reading file ${notePath}:`, error);
    return null;
  }
}

// Helper function to check if a note matches the query
function matchesQuery(note: any, query: string): boolean {
  if (!query) return true;
  
  const searchTerm = query.toLowerCase();
  const searchableText = [
    note.title,
    note.abstract,
    note.content
  ].join(' ').toLowerCase();
  
  return searchableText.includes(searchTerm);
}

// Helper function to check if a note matches the tags
function matchesTags(note: any, tags: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  
  const noteTags = note.tags || [];
  return tags.some(tag => noteTags.includes(tag));
}

// Abstracted filtering function
async function applyFilter(mdxFiles: string[], query?: string, tags?: string[]): Promise<string[]> {
  // If no filtering is applied, return all files
  if (!query && (!tags || tags.length === 0)) {
    return mdxFiles;
  }
  
  // Filter notes based on query and tags
  const filteredNotes = [];
  for (const file of mdxFiles) {
    const note = await readMdxFile(file);
    
    if (note && matchesQuery(note, query) && matchesTags(note, tags)) {
      filteredNotes.push(file);
    }
  }
  
  return filteredNotes;
}

// Abstracted pagination function
function applyPagination(files: string[], page: string | undefined): string[] {
  const sliceStart = (Number(page || '1') - 1) * CARDS_BY_PAGE;
  const sliceEnd = Number(page || '1') * CARDS_BY_PAGE;
  return files.slice(sliceStart, sliceEnd);
}

export async function fetchAmountPages({
  query,
  tags,
}: {
  query?: string,
  tags?: string[],
}) {
  const baseDir = path.join(process.cwd(), '/src/content');
  const mdxFiles = fs.readdirSync(baseDir)
                      .filter((file) => file.endsWith('.mdx'));
  
  const filteredNotes = await applyFilter(mdxFiles, query, tags);
  return Math.ceil(filteredNotes.length / CARDS_BY_PAGE);
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
  const baseDir = path.join(process.cwd(), '/src/content');
  const mdxFiles = fs.readdirSync(baseDir)
                      .filter((file) => file.endsWith('.mdx'));
  
  const filteredNotes = await applyFilter(mdxFiles, query, tags);
  const paginatedNotes = applyPagination(filteredNotes, page);
  
  return paginatedNotes.map(path => path.replace(/\.mdx$/, ''));
}
