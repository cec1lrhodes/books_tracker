import { createFileRoute } from "@tanstack/react-router";

import BottomNav from "@/components/layout/BottomNav";
import ReadingProgress from "@/components/layout/ReadingProgress";
import SectionHeading from "@/components/layout/SectionHeading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Book, type Thought } from "@/data/books";
import { useBooks } from "@/store/useLibrary";

type LatestThought = {
  bookName: string;
  thought: Thought;
};

const USERNAME = "Ceaser12";

const getLatestThought = (books: Book[]): LatestThought | null => {
  const bookWithThought = books.find((book) => book.thoughts.length > 0);

  if (!bookWithThought) return null;

  return {
    bookName: bookWithThought.name,
    thought: bookWithThought.thoughts[0],
  };
};

const ProfileRoute = () => {
  const books = useBooks();
  const totalBooks = books.length;
  const completedBooks = books.filter(
    (book) => book.status === "finished",
  ).length;
  const latestThought = getLatestThought(books);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <header className="flex items-center gap-4">
          <Avatar
            size="lg"
            className="size-14 border border-border bg-card text-foreground"
          >
            <AvatarFallback className="text-lg font-semibold">C</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {USERNAME}
          </h1>
        </header>

        <section
          aria-labelledby="profile-progress"
          className="mt-6 rounded-2xl bg-card p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <SectionHeading id="profile-progress">
              Прочитано книг
            </SectionHeading>
            <span className="text-sm font-semibold text-foreground">
              {completedBooks} / {totalBooks}
            </span>
          </div>
          <ReadingProgress
            currentPage={completedBooks}
            totalPages={Math.max(totalBooks, 1)}
            withPercent={false}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {totalBooks === 0
              ? "У бібліотеці ще немає книг"
              : `${Math.round((completedBooks / totalBooks) * 100)}% виконано`}
          </p>
        </section>

        <section aria-labelledby="latest-thought" className="mt-8">
          <SectionHeading id="latest-thought" className="mb-2">
            Остання замітка
          </SectionHeading>

          {latestThought ? (
            <article className="rounded-xl bg-card px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                "{latestThought.thought.text}"
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {latestThought.bookName} · {latestThought.thought.label}
              </p>
            </article>
          ) : (
            <p className="rounded-xl bg-card px-4 py-3 text-sm text-muted-foreground">
              Заміток поки немає.
            </p>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
});
