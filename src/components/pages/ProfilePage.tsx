import { useMemo } from "react";

import BottomNav from "@/components/layout/BottomNav";
import ReadingProgress from "@/components/layout/ReadingProgress";
import SectionHeading from "@/components/layout/SectionHeading";
import ReadingActivityChart from "@/components/profile/ReadingActivityChart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { type Book, type Thought } from "@/data/books";
import {
  getMonthlyPagesData,
  getYearlyPagesData,
} from "@/lib/readingActivity";
import { useBooks } from "@/store/useLibrary";

type LatestThought = {
  bookName: string;
  thought: Thought;
};

const USERNAME = "Ceaser12";

const CURRENT_MONTH_LABEL = new Date().toLocaleDateString("uk-UA", {
  month: "long",
});
const CURRENT_YEAR_LABEL = String(new Date().getFullYear());

const getLatestThought = (books: Book[]): LatestThought | null => {
  const bookWithThought = books.find((book) => book.thoughts.length > 0);

  if (!bookWithThought) return null;

  return {
    bookName: bookWithThought.name,
    thought: bookWithThought.thoughts[0],
  };
};

const ProfilePage = () => {
  const books = useBooks();
  const totalBooks = books.length;
  const completedBooks = books.filter(
    (book) => book.status === "finished",
  ).length;
  const latestThought = getLatestThought(books);

  const monthlyData = useMemo(() => getMonthlyPagesData(books), [books]);
  const yearlyData = useMemo(() => getYearlyPagesData(books), [books]);

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

        <section
          aria-labelledby="reading-activity"
          className="mt-6 rounded-2xl bg-card p-4"
        >
          <SectionHeading id="reading-activity" className="mb-3">
            Активність читання
          </SectionHeading>

          <Tabs defaultValue="month" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="month">Місяць</TabsTrigger>
              <TabsTrigger value="year">Рік</TabsTrigger>
            </TabsList>

            <TabsContent value="month">
              <p className="mb-2 text-xs text-muted-foreground capitalize">
                {CURRENT_MONTH_LABEL}
              </p>
              <ReadingActivityChart
                data={monthlyData}
                emptyMessage="Цього місяця ще немає прочитаних сторінок"
                minTickGap={20}
                className="h-44 w-full"
              />
            </TabsContent>

            <TabsContent value="year">
              <p className="mb-2 text-xs text-muted-foreground">
                {CURRENT_YEAR_LABEL}
              </p>
              <ReadingActivityChart
                data={yearlyData}
                emptyMessage="Цього року ще немає прочитаних сторінок"
                minTickGap={4}
                className="h-44 w-full"
              />
            </TabsContent>
          </Tabs>
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

export default ProfilePage;
