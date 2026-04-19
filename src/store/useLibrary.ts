import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { books as initialBooks, type Book } from "@/data/books"

export type NewBookInput = {
  name: string
  author: string
  totalPages: number
}

type LibraryState = {
  books: Book[]
  addBook: (input: NewBookInput) => void
  getBookById: (id: string) => Book | undefined
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "book"

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
})

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      books: initialBooks,
      addBook: (input) =>
        set((state) => ({ books: [createBook(input), ...state.books] })),
      getBookById: (id) => get().books.find((book) => book.id === id),
    }),
    {
      name: "books-tracker:library",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ books: state.books }),
      version: 1,
    },
  ),
)

export const useBooks = (): Book[] =>
  useLibraryStore((state) => state.books)

export const useBookById = (id: string): Book | undefined =>
  useLibraryStore((state) => state.books.find((book) => book.id === id))

export const useAddBook = (): LibraryState["addBook"] =>
  useLibraryStore((state) => state.addBook)
