import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type Genre } from "@/data/genres";
import { fetchOpenLibraryBooksByGenres } from "@/services/openLibrary";
import { type ExploreBook } from "@/types/explore";

const buildCacheKey = (genres: Genre[]) =>
  genres.length === 0 ? "empty" : [...genres].sort().join("|");

const BOOKS_PER_PAGE = 12;

type ExploreBooksCacheEntry = {
  books: ExploreBook[];
  nextOffset: number;
  hasMore: boolean;
};

//  приймає жанри, завантажує книги з Open Library і кешує результат, щоб не робити повторні запити для того самого набору жанрів
export const useExploreBooks = (genres: Genre[]) => {
  const cacheRef = useRef<Record<string, ExploreBooksCacheEntry>>({});
  const cacheKey = useMemo(() => buildCacheKey(genres), [genres]);
  const [books, setBooks] = useState<ExploreBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const updateCacheEntry = useCallback(
    (entry: ExploreBooksCacheEntry) => {
      cacheRef.current[cacheKey] = entry;
      setBooks(entry.books);
      setHasMore(entry.hasMore);
    },
    [cacheKey],
  );

  useEffect(() => {
    if (genres.length === 0) {
      setBooks([]);
      setIsLoading(false);
      setIsLoadingMore(false);
      setErrorMessage("");
      setHasMore(false);
      return;
    }

    const cachedEntry = cacheRef.current[cacheKey];

    if (cachedEntry) {
      setBooks(cachedEntry.books);
      setIsLoading(false);
      setIsLoadingMore(false);
      setErrorMessage("");
      setHasMore(cachedEntry.hasMore);
      return;
    }

    // створюємо контролер для анулювання запиту
    const controller = new AbortController();

    const loadBooks = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextBooks = await fetchOpenLibraryBooksByGenres(
          genres,
          controller.signal,
          BOOKS_PER_PAGE,
          0,
        );

        updateCacheEntry({
          books: nextBooks.books,
          nextOffset: BOOKS_PER_PAGE,
          hasMore: nextBooks.hasMore && nextBooks.books.length > 0,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        setErrorMessage(
          "Could not load books from Open Library. Try again later.",
        );
        setBooks([]);
        setHasMore(false);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadBooks();

    return () => controller.abort();
  }, [cacheKey, genres, updateCacheEntry]);

  const loadMore = useCallback(async () => {
    if (genres.length === 0 || isLoading || isLoadingMore || !hasMore) return;

    const cachedEntry = cacheRef.current[cacheKey];

    if (!cachedEntry) return;

    const controller = new AbortController();

    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      const nextBooks = await fetchOpenLibraryBooksByGenres(
        genres,
        controller.signal,
        BOOKS_PER_PAGE,
        cachedEntry.nextOffset,
      );
      const mergedBooks = Array.from(
        new Map(
          [...cachedEntry.books, ...nextBooks.books].map((book) => [
            book.id,
            book,
          ]),
        ).values(),
      );
      const hasNextPage = nextBooks.hasMore && nextBooks.books.length > 0;

      updateCacheEntry({
        books: mergedBooks,
        nextOffset: cachedEntry.nextOffset + BOOKS_PER_PAGE,
        hasMore: hasNextPage,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      setErrorMessage("Could not load more books from Open Library.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    cacheKey,
    genres,
    hasMore,
    isLoading,
    isLoadingMore,
    updateCacheEntry,
  ]);

  return {
    books,
    isLoading,
    isLoadingMore,
    errorMessage,
    hasMore,
    loadMore,
  };
};
