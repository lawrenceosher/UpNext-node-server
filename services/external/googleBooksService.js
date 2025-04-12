import axios from 'axios';

const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1/volumes';

export async function searchGoogleBooks(query) {
  const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(query)}&maxResults=10`;

  const res = await axios.get(url);
  const items = res.data?.items || [];

  const normalizedBooks = items.map((item) => {
    const volumeInfo = item.volumeInfo;

    return {
      _id: item.id,
      title: volumeInfo.title || 'Untitled',
      authors: volumeInfo.authors || ['Unknown'],
      synopsis: volumeInfo.description || 'No description available.',
      publisher: volumeInfo.publisher || 'Unknown publisher',
      coverArt: volumeInfo.imageLinks?.thumbnail || '',
      datePublished: volumeInfo.publishedDate || '',
      pages: volumeInfo.pageCount || 0,
      sourceUrl: volumeInfo.infoLink || `https://books.google.com/books?id=${item.id}`,
    };
  });

  return normalizedBooks;
}

export async function fetchGoogleBookById(bookId) {
    const url = `${GOOGLE_BOOKS_BASE}/${bookId}`;
  
    try {
      const res = await axios.get(url);
      const item = res.data;
      const volumeInfo = item.volumeInfo;
  
      const normalized = {
        _id: item.id,
        title: volumeInfo.title || 'Untitled',
        authors: volumeInfo.authors || ['Unknown'],
        synopsis: volumeInfo.description || 'No description available.',
        publisher: volumeInfo.publisher || 'Unknown publisher',
        coverArt: volumeInfo.imageLinks?.thumbnail || '',
        datePublished: volumeInfo.publishedDate || '',
        pages: volumeInfo.pageCount || 0,
        sourceUrl: volumeInfo.infoLink || `https://books.google.com/books?id=${item.id}`,
      };
  
      return normalized;
    } catch (error) {
      console.error(`Error fetching book with ID ${bookId}:`, error);
      return null;
    }
  }
