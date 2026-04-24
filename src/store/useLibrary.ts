import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  books as initialBooks,
  type Book,
  type ReadingSession,
  type Thought,
} from "@/data/books";

export type NewBookInput = {
  name: string;
  author: string;
  totalPages: number;
  coverImage?: string;
};

export type BookDetailsUpdate = {
  name: string;
  author: string;
  totalPages: number;
};

type LibraryState = {
  books: Book[];
  addBook: (input: NewBookInput) => void;
  addReadingSession: (bookId: string, pagesRead: number) => void;
  addThought: (bookId: string, text: string) => void;
  updateBookDetails: (bookId: string, details: BookDetailsUpdate) => void;
  setBookRating: (bookId: string, rating: number) => void;
  setBookGenres: (bookId: string, genres: string[]) => void;
  setBookCover: (bookId: string, coverImage: string | undefined) => void;
  deleteBook: (bookId: string) => void;
  getBookById: (id: string) => Book | undefined;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "book";

const createBook = ({
  name,
  author,
  totalPages,
  coverImage,
}: NewBookInput): Book => ({
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
  thoughts: [],
  coverImage,
});

const formatDayLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

const createSession = (fromPage: number, toPage: number): ReadingSession => ({
  id: `s-${Date.now()}`,
  label: formatDayLabel(new Date()),
  fromPage,
  toPage,
});

const createThought = (text: string): Thought => ({
  id: `t-${Date.now()}`,
  label: formatDayLabel(new Date()),
  text,
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
      addThought: (bookId, text) =>
        set((state) => {
          const trimmed = text.trim();
          if (trimmed.length === 0) return state;
          return {
            books: state.books.map((book) =>
              book.id === bookId
                ? { ...book, thoughts: [createThought(trimmed), ...book.thoughts] }
                : book,
            ),
          };
        }),
      updateBookDetails: (bookId, details) =>
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const name = details.name.trim();
            const author = details.author.trim();
            const totalPages = Math.max(1, Math.floor(details.totalPages));
            if (name.length === 0 || author.length === 0) return book;
            const currentPage = Math.min(book.currentPage, totalPages);
            return {
              ...book,
              name,
              author,
              totalPages,
              currentPage,
              status:
                currentPage >= totalPages
                  ? "finished"
                  : currentPage > 0
                    ? "reading"
                    : book.status,
            };
          }),
        })),
      setBookRating: (bookId, rating) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, rating: Math.max(0, Math.min(5, Math.round(rating))) }
              : book,
          ),
        })),
      setBookGenres: (bookId, genres) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, genres: [...new Set(genres)] } : book,
          ),
        })),
      setBookCover: (bookId, coverImage) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, coverImage } : book,
          ),
        })),
      deleteBook: (bookId) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
        })),
      getBookById: (id) => get().books.find((book) => book.id === id),
    }),
    {
      name: "books-tracker:library",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ books: state.books }),
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          const legacy = persistedState as { books?: Array<Book & { thoughts?: Thought[] }> };
          return {
            books: (legacy.books ?? []).map((book) => ({
              ...book,
              thoughts: book.thoughts ?? [],
            })),
          };
        }
        return persistedState as { books: Book[] };
      },
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

export const useAddThought = (): LibraryState["addThought"] =>
  useLibraryStore((state) => state.addThought);

export const useUpdateBookDetails = (): LibraryState["updateBookDetails"] =>
  useLibraryStore((state) => state.updateBookDetails);

export const useSetBookRating = (): LibraryState["setBookRating"] =>
  useLibraryStore((state) => state.setBookRating);

export const useSetBookGenres = (): LibraryState["setBookGenres"] =>
  useLibraryStore((state) => state.setBookGenres);

export const useSetBookCover = (): LibraryState["setBookCover"] =>
  useLibraryStore((state) => state.setBookCover);

export const useDeleteBook = (): LibraryState["deleteBook"] =>
  useLibraryStore((state) => state.deleteBook);
