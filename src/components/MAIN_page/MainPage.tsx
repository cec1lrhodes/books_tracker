import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BookCover from "./BookCover";
import Footer_main from "./Footer_main";
import StarRating from "./StarRating";

type CurrentlyReadingBook = {
  id: number;
  name: string;
  author: string;
  currentPage: number;
  totalPages: number;
};

type FinishedBook = {
  id: number;
  name: string;
  author: string;
  finishedAgo: string;
  rating: number;
};

const currentlyReading: CurrentlyReadingBook[] = [
  {
    id: 1,
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    currentPage: 156,
    totalPages: 228,
  },
  {
    id: 2,
    name: "1984",
    author: "George Orwell",
    currentPage: 68,
    totalPages: 298,
  },
  {
    id: 5,
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    currentPage: 32,
    totalPages: 310,
  },
  {
    id: 6,
    name: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    currentPage: 100,
    totalPages: 1000,
  },
];

const recentlyFinished: FinishedBook[] = [
  {
    id: 3,
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    finishedAgo: "2 weeks ago",
    rating: 5,
  },
  {
    id: 4,
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    finishedAgo: "last month",
    rating: 3,
  },
];

const filterTabs = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
  { value: "planned", label: "Planned" },
] as const;

const getProgressPercent = (current: number, total: number) =>
  Math.min(100, Math.round((current / total) * 100));

const MainPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {/* Filter tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            {filterTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Currently reading */}
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
                  <Card>
                    <CardContent className="flex items-center gap-3">
                      <BookCover className="h-20 w-14" />
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
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recently finished */}
        <section aria-labelledby="recently-finished" className="mt-6">
          <h2
            id="recently-finished"
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Recently finished
          </h2>
          <ul className="flex flex-col gap-3">
            {recentlyFinished.map((book) => (
              <li key={book.id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate text-base font-semibold text-foreground">
                        {book.name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {book.author} · {book.finishedAgo}
                      </p>
                    </div>
                    <StarRating value={book.rating} />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer_main />
    </div>
  );
};

export default MainPage;
