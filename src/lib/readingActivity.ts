import type { Book } from "@/data/books";

export type DailyActivityPoint = {
  day: number;
  label: string;
  pages: number;
};

export type MonthlyActivityPoint = {
  month: number;
  label: string;
  pages: number;
};

const MONTH_LABELS = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
] as const;

const getSessionPages = (fromPage: number, toPage: number): number =>
  Math.max(0, toPage - fromPage);

const parseSessionDate = (createdAt?: string): Date | null => {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const getMonthlyPagesData = (
  books: Book[],
  reference: Date = new Date(),
): DailyActivityPoint[] => {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const pagesByDay = new Array<number>(daysInMonth).fill(0);

  books.forEach((book) => {
    book.sessions.forEach((session) => {
      const sessionDate = parseSessionDate(session.createdAt);
      if (!sessionDate) return;
      if (
        sessionDate.getFullYear() !== year ||
        sessionDate.getMonth() !== month
      ) {
        return;
      }
      const day = sessionDate.getDate();
      pagesByDay[day - 1] += getSessionPages(session.fromPage, session.toPage);
    });
  });

  return pagesByDay.map((pages, index) => ({
    day: index + 1,
    label: String(index + 1),
    pages,
  }));
};

export const getYearlyPagesData = (
  books: Book[],
  reference: Date = new Date(),
): MonthlyActivityPoint[] => {
  const year = reference.getFullYear();
  const pagesByMonth = new Array<number>(12).fill(0);

  books.forEach((book) => {
    book.sessions.forEach((session) => {
      const sessionDate = parseSessionDate(session.createdAt);
      if (!sessionDate) return;
      if (sessionDate.getFullYear() !== year) return;
      pagesByMonth[sessionDate.getMonth()] += getSessionPages(
        session.fromPage,
        session.toPage,
      );
    });
  });

  return pagesByMonth.map((pages, index) => ({
    month: index + 1,
    label: MONTH_LABELS[index],
    pages,
  }));
};
