import axios from "axios";

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * Normalizes the book data from Google Books API to a consistent format.
 * @param item - The book item from the API response.
 * @returns The normalized book object.
 */
const normalizeBook = (item) => {
  const volumeInfo = item.volumeInfo;

  return {
    _id: item.id,
    title: volumeInfo.title || "Untitled",
    authors: volumeInfo.authors || ["Unknown"],
    synopsis: volumeInfo.description || "No description available.",
    publisher: volumeInfo.publisher || "Unknown publisher",
    coverArt: volumeInfo.imageLinks?.thumbnail || "",
    datePublished: volumeInfo.publishedDate || "",
    pages: volumeInfo.pageCount || 0,
    sourceUrl:
      volumeInfo.infoLink || `https://books.google.com/books?id=${item.id}`,
  };
};

/**
 * Fetches books from Google Books API based on a search query.
 * @param {string} query - The search query.
 * @returns A promise that resolves to an array of normalized book objects.
 */
export async function searchGoogleBooks(query) {
  // Encode the query in the endpoint URL and limit the number of results to 10
  const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
    query
  )}&maxResults=10`;

  try {
    // Make a GET request to the Google Books API
    const res = await axios.get(url);
    const books = res.data?.items || [];

    // Normalize the response to a consistent format in accordance with the Book schema
    const normalizedBooks = books.map((book) => {
      return normalizeBook(book);
    });

    return normalizedBooks;
  } catch (error) {
    return { error: `Error fetching books: ${error}` };
  }
}

/**
 * Fetches a book from Google Books API by its ID.
 * @param bookId - The ID of the book to fetch.
 * @returns A promise that resolves to a normalized book object.
 */
export async function fetchGoogleBookById(bookId) {
  // Encode the book ID in the endpoint URL
  const url = `${GOOGLE_BOOKS_BASE}/${bookId}`;

  try {
    // Make a GET request to the Google Books API
    const res = await axios.get(url);
    const item = res.data;

    // Normalize the response to a consistent format in accordance with the Book schema
    return normalizeBook(item);
  } catch (error) {
    return { error: `Error fetching book with ID ${bookId}: ${error}` };
  }
}
