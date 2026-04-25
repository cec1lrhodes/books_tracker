import { useEffect, useMemo, useRef, useState } from "react";

import { type Genre } from "@/data/genres";
import { fetchOpenLibraryBooksByGenres } from "@/services/openLibrary";
import { type ExploreBook } from "@/types/explore";

const buildCacheKey = (genres: Genre[]) =>
  genres.length === 0 ? "empty" : [...genres].sort().join("|");

//  приймає жанри, завантажує книги з Open Library і кешує результат, щоб не робити повторні запити для того самого набору жанрів
export const useExploreBooks = (genres: Genre[]) => {
  const cacheRef = useRef<Record<string, ExploreBook[]>>({});
  const cacheKey = useMemo(() => buildCacheKey(genres), [genres]);
  const [books, setBooks] = useState<ExploreBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (genres.length === 0) {
      setBooks([]);
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    const cachedBooks = cacheRef.current[cacheKey];

    if (cachedBooks) {
      setBooks(cachedBooks);
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    const controller = new AbortController();

    const loadBooks = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextBooks = await fetchOpenLibraryBooksByGenres(
          genres,
          controller.signal,
        );

        cacheRef.current[cacheKey] = nextBooks;
        setBooks(nextBooks);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        setErrorMessage(
          "Could not load books from Open Library. Try again later.",
        );
        setBooks([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadBooks();

    return () => controller.abort();
  }, [cacheKey, genres]);

  return {
    books,
    isLoading,
    errorMessage,
  };
};
