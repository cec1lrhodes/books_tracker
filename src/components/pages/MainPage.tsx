import { useState } from "react";
import { Link } from "@tanstack/react-router";

import BookCover from "@/components/layout/BookCover";
import StarRating from "@/components/layout/StarRating";
import BottomNav from "@/components/layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProgressPercent, type Book, type BookStatus } from "@/data/books";
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

const renderSimpleBookItem = (book: Book) => (
  <li key={book.id}>
    <Link
      to="/library/$bookId"
      params={{ bookId: book.id }}
      aria-label={`Open ${book.name}`}
      className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card>
        <CardContent className="flex items-center gap-3">
          <BookCover
            className="h-20 w-14"
            src={book.coverImage}
            alt={`${book.name} cover`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-base font-semibold text-foreground">
              {book.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {book.author}
              {book.finishedAgo ? ` · ${book.finishedAgo}` : ""}
            </p>
          </div>
          <StarRating value={book.rating} />
        </CardContent>
      </Card>
    </Link>
  </li>
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
            <h2
              id="filtered-books"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {filterSectionTitles[activeFilter]}
            </h2>
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
              <h2
                id="currently-reading"
                className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Currently reading
              </h2>
              <ul className="flex flex-col gap-3">
                {currentlyReading.map((book) => {
                  const percent = getProgressPercent(
                    book.currentPage,
                    book.totalPages,
                  );
                  return (
                    <li key={book.id}>
                      <Link
                        to="/library/$bookId"
                        params={{ bookId: book.id }}
                        aria-label={`Open ${book.name}`}
                        className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Card>
                          <CardContent className="flex items-center gap-3">
                            <BookCover
                              className="h-20 w-14"
                              src={book.coverImage}
                              alt={`${book.name} cover`}
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <p className="truncate text-base font-semibold text-foreground">
                                {book.name}
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                {book.author}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                p. {book.currentPage} / {book.totalPages}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Progress value={percent} className="flex-1" />
                                <span className="text-xs font-medium text-foreground">
                                  {percent}%
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="recently-finished" className="mt-6">
              <h2
                id="recently-finished"
                className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Recently finished
              </h2>
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
