import SectionHeading from "@/components/layout/SectionHeading";
import { type ExploreBook } from "@/types/explore";

import ExploreBookCard from "./ExploreBookCard";

type ExploreBooksSectionProps = {
  title: string;
  books: ExploreBook[];
  isLoading: boolean;
  errorMessage: string;
};

const ExploreBooksSection = ({
  title,
  books,
  isLoading,
  errorMessage,
}: ExploreBooksSectionProps) => (
  <section aria-labelledby="explore-books" className="mt-5">
    <SectionHeading id="explore-books" className="mb-2">
      {title}
    </SectionHeading>

    {isLoading && (
      <p className="text-sm text-muted-foreground">Loading books...</p>
    )}

    {!isLoading && errorMessage && (
      <p className="text-sm text-destructive">{errorMessage}</p>
    )}

    {!isLoading && !errorMessage && books.length === 0 && (
      <p className="text-sm text-muted-foreground">
        Select at least one genre to discover books.
      </p>
    )}

    {!isLoading && !errorMessage && books.length > 0 && (
      <ul className="flex flex-col gap-3">
        {books.map((book) => (
          <ExploreBookCard key={book.id} book={book} />
        ))}
      </ul>
    )}
  </section>
);

export default ExploreBooksSection;
