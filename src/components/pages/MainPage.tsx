import { useState } from "react";

import BookListItem from "@/components/layout/BookListItem";
import BottomNav from "@/components/layout/BottomNav";
import ReadingProgress from "@/components/layout/ReadingProgress";
import SectionHeading from "@/components/layout/SectionHeading";
import StarRating from "@/components/layout/StarRating";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Book, type BookStatus } from "@/data/books";
import { useBooks } from "@/store/useLibrary";

type FilterValue = "all" | BookStatus;

const filterTabs: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
  { value: "planned", label: "Planned" },
];

const filterSectionTitles: Record<Exclude<FilterValue, "all">, string> = {
  reading: "Reading",
  finished: "Finished",
  planned: "Planned",
};

const buildSimpleSubtitle = (book: Book) =>
  book.finishedAgo ? `${book.author} · ${book.finishedAgo}` : book.author;

const renderSimpleBookItem = (book: Book) => (
  <BookListItem
    key={book.id}
    book={book}
    subtitle={buildSimpleSubtitle(book)}
    trailing={<StarRating value={book.rating} />}
  />
);

const renderReadingBookItem = (book: Book) => (
  <BookListItem
    key={book.id}
    book={book}
    subtitle={book.author}
    extra={
      <>
        <p className="text-xs text-muted-foreground">
          p. {book.currentPage} / {book.totalPages}
        </p>
        <ReadingProgress
          currentPage={book.currentPage}
          totalPages={book.totalPages}
          className="mt-1"
        />
      </>
    }
  />
);

const MainPage = () => {
  const books = useBooks();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const handleFilterChange = (value: string) =>
    setActiveFilter(value as FilterValue);

  const currentlyReading = books.filter((book) => book.status === "reading");
  const recentlyFinished = books.filter((book) => book.status === "finished");
  const filteredBooks =
    activeFilter === "all"
      ? []
      : books.filter((book) => book.status === activeFilter);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <Tabs
          value={activeFilter}
          onValueChange={handleFilterChange}
          className="w-full"
        >
          <TabsList className="w-full">
            {filterTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeFilter !== "all" && (
          <section aria-labelledby="filtered-books" className="mt-5">
            <SectionHeading id="filtered-books" className="mb-2">
              {filterSectionTitles[activeFilter]}
            </SectionHeading>
            {filteredBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No books in this category yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {filteredBooks.map(renderSimpleBookItem)}
              </ul>
            )}
          </section>
        )}

        {activeFilter === "all" && (
          <>
            <section aria-labelledby="currently-reading" className="mt-5">
              <SectionHeading id="currently-reading" className="mb-2">
                Currently reading
              </SectionHeading>
              <ul className="flex flex-col gap-3">
                {currentlyReading.map(renderReadingBookItem)}
              </ul>
            </section>

            <section aria-labelledby="recently-finished" className="mt-6">
              <SectionHeading id="recently-finished" className="mb-2">
                Recently finished
              </SectionHeading>
              <ul className="flex flex-col gap-3">
                {recentlyFinished.map(renderSimpleBookItem)}
              </ul>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MainPage;
