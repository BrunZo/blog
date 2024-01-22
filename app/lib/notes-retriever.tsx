import { MongoClient } from "mongodb";

export const CARDS_BY_PAGE = 6;

export async function fetchAmountPages({
  query,
  tags,
  page
}: {
  query?: string,
  tags?: string[],
  page?: string
}) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('local');
  const articleCount = await db.collection('notes')
    .countDocuments(query ? { 
      $or: [
        { title: { $regex: query, $options: 'i' }},
        { abstract: { $regex: query, $options: 'i' }},
        { tags: { $all: tags || [] } }
      ]
    } : {})
  return Math.ceil(articleCount / CARDS_BY_PAGE);
}

export async function fetchFilteredArticles({
  query,
  tags,
  page
}: {
  query?: string,
  tags?: string[],
  page?: string
}) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('local');
  const notes = await db.collection('notes')
    .find(query ? { 
      $or: [
        { title: { $regex: query, $options: 'i' }},
        { abstract: { $regex: query, $options: 'i' }},
        { tags: { $all: tags || [] } }
      ]
    } : {})
    .skip((Number(page) - 1) * CARDS_BY_PAGE)
    .limit(CARDS_BY_PAGE)
    .toArray();
  return notes;
}