import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { type Genre } from "@/data/genres";
import { fetchOpenLibraryBooksByGenres } from "@/services/openLibrary";
import { type ExploreBook } from "@/types/explore";

const buildCacheKey = (genres: Genre[]) =>
  genres.length === 0 ? "empty" : [...genres].sort().join("|");

const BOOKS_PER_PAGE = 12;

const getUniqueBooks = (books: ExploreBook[]) =>
  Array.from(new Map(books.map((book) => [book.id, book])).values());

export const useExploreBooks = (genres: Genre[]) => {
  const cacheKey = useMemo(() => buildCacheKey(genres), [genres]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["explore-books", cacheKey],
    queryFn: ({ pageParam, signal }) =>
      fetchOpenLibraryBooksByGenres(genres, signal, BOOKS_PER_PAGE, pageParam),
    initialPageParam: 0,
    enabled: genres.length > 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore || lastPage.books.length === 0) return undefined;

      return allPages.length * BOOKS_PER_PAGE;
    },
  });

  const books = useMemo(
    () => getUniqueBooks(data?.pages.flatMap((page) => page.books) ?? []),
    [data],
  );
  const isLoading = genres.length > 0 && isPending;
  const hasMore = Boolean(hasNextPage);
  const errorMessage = isError
    ? "Could not load books from Open Library. Try again later."
    : "";

  const loadMore = useCallback(() => {
    if (genres.length === 0 || isLoading || isFetchingNextPage || !hasMore)
      return;

    fetchNextPage();
  }, [fetchNextPage, genres.length, hasMore, isFetchingNextPage, isLoading]);

  return {
    books,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    errorMessage,
    hasMore,
    loadMore,
  };
};
