import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  books as initialBooks,
  type Book,
  type ReadingSession,
} from "@/data/books";

export type NewBookInput = {
  name: string;
  author: string;
  totalPages: number;
};

type LibraryState = {
  books: Book[];
  addBook: (input: NewBookInput) => void;
  addReadingSession: (bookId: string, pagesRead: number) => void;
  getBookById: (id: string) => Book | undefined;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "book";

const createBook = ({ name, author, totalPages }: NewBookInput): Book => ({
  id: `${slugify(name)}-${Date.now()}`,
  name,
  author,
  year: new Date().getFullYear(),
  genres: [],
  rating: 0,
  totalPages,
  currentPage: 0,
  status: "planned",
  sessions: [],
});

const formatSessionLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

const createSession = (fromPage: number, toPage: number): ReadingSession => ({
  id: `s-${Date.now()}`,
  label: formatSessionLabel(new Date()),
  fromPage,
  toPage,
});

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      books: initialBooks,
      addBook: (input) =>
        set((state) => ({ books: [createBook(input), ...state.books] })),
      addReadingSession: (bookId, pagesRead) =>
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            if (!Number.isFinite(pagesRead) || pagesRead <= 0) return book;
            const fromPage = book.currentPage;
            const toPage = Math.min(book.totalPages, fromPage + pagesRead);
            if (toPage <= fromPage) return book;
            return {
              ...book,
              currentPage: toPage,
              status: toPage >= book.totalPages ? "finished" : "reading",
              sessions: [createSession(fromPage, toPage), ...book.sessions],
            };
          }),
        })),
      getBookById: (id) => get().books.find((book) => book.id === id),
    }),
    {
      name: "books-tracker:library",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ books: state.books }),
      version: 1,
    },
  ),
);

export const useBooks = (): Book[] => useLibraryStore((state) => state.books);

export const useBookById = (id: string): Book | undefined =>
  useLibraryStore((state) => state.books.find((book) => book.id === id));

export const useAddBook = (): LibraryState["addBook"] =>
  useLibraryStore((state) => state.addBook);

export const useAddReadingSession = (): LibraryState["addReadingSession"] =>
  useLibraryStore((state) => state.addReadingSession);
