import ReadingProgress from "@/components/layout/ReadingProgress";
import SectionHeading from "@/components/layout/SectionHeading";
import { getProgressPercent } from "@/data/books";
import type { Book } from "@/data/books";

type BookProgressSectionProps = {
  book: Book;
};

const BookProgressSection = ({ book }: BookProgressSectionProps) => {
  const percent = getProgressPercent(book.currentPage, book.totalPages);

  return (
    <section aria-labelledby="progress-heading" className="mt-8">
      <div className="flex items-center justify-between">
        <SectionHeading id="progress-heading">Progress</SectionHeading>
        <span className="text-sm font-medium text-foreground">
          {book.currentPage} / {book.totalPages} pages
        </span>
      </div>
      <ReadingProgress
        currentPage={book.currentPage}
        totalPages={book.totalPages}
        withPercent={false}
        className="mt-3"
      />
      <div className="mt-2 flex items-center justify-between text-xs">
        {book.startedAt ? (
          <span className="text-muted-foreground">
            Started {book.startedAt}
          </span>
        ) : (
          <span />
        )}
        <span className="font-semibold text-foreground">{percent}%</span>
      </div>
    </section>
  );
};

export default BookProgressSection;
