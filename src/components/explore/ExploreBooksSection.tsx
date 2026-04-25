import { useEffect, useRef } from "react";

import SectionHeading from "@/components/layout/SectionHeading";
import { Spinner } from "@/components/ui/spinner";
import { type ExploreBook } from "@/types/explore";

import ExploreBookCard from "./ExploreBookCard";

type ExploreBooksSectionProps = {
  title: string;
  books: ExploreBook[];
  isLoading: boolean;
  isLoadingMore: boolean;
  errorMessage: string;
  hasMore: boolean;
  onLoadMore: () => void;
};

const ExploreBooksSection = ({
  title,
  books,
  isLoading,
  isLoadingMore,
  errorMessage,
  hasMore,
  onLoadMore,
}: ExploreBooksSectionProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  return (
    <section aria-labelledby="explore-books" className="mt-5">
      <SectionHeading id="explore-books" className="mb-2">
        {title}
      </SectionHeading>

      {isLoading && books.length === 0 && (
        <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Loading books...</span>
        </div>
      )}

      {!isLoading && errorMessage && books.length === 0 && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && books.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one genre to discover books.
        </p>
      )}

      {books.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {books.map((book) => (
              <ExploreBookCard key={book.id} book={book} />
            ))}
          </ul>

          <div
            ref={loadMoreRef}
            className="flex min-h-14 items-center justify-center py-4"
            aria-live="polite"
          >
            {isLoadingMore && (
              <Spinner className="size-5 text-muted-foreground" />
            )}
            {!isLoadingMore && errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ExploreBooksSection;
