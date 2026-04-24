export type BookStatus = "reading" | "finished" | "planned";

export type ReadingSession = {
  id: string;
  label: string;
  fromPage: number;
  toPage: number;
  minutes?: number;
};

export type Thought = {
  id: string;
  label: string;
  text: string;
};

export type Book = {
  id: string;
  name: string;
  author: string;
  year: number;
  genres: string[];
  rating: number;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  startedAt?: string;
  finishedAgo?: string;
  sessions: ReadingSession[];
  thoughts: Thought[];
  coverImage?: string;
};

export const books: Book[] = [
  {
    id: "the-great-gatsby",
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    genres: ["Classic", "Fiction", "Novel"],
    rating: 4,
    totalPages: 228,
    currentPage: 156,
    status: "reading",
    startedAt: "Mar 28",
    sessions: [
      { id: "s1", label: "Today", fromPage: 140, toPage: 156, minutes: 35 },
      { id: "s2", label: "Apr 15", fromPage: 110, toPage: 140, minutes: 48 },
      { id: "s3", label: "Apr 12", fromPage: 80, toPage: 110, minutes: 52 },
    ],
    thoughts: [
      {
        id: "t1",
        label: "Apr 15",
        text: "Gatsby's obsession with the past feels so tragic and timeless at the same time.",
      },
      {
        id: "t2",
        label: "Apr 12",
        text: "The green light on the dock is such a perfect symbol of unreachable dreams.",
      },
    ],
  },
  {
    id: "1984",
    name: "1984",
    author: "George Orwell",
    year: 1949,
    genres: ["Dystopia", "Classic", "Political"],
    rating: 5,
    totalPages: 298,
    currentPage: 68,
    status: "reading",
    startedAt: "Apr 02",
    sessions: [
      { id: "s1", label: "Apr 14", fromPage: 50, toPage: 68, minutes: 28 },
      { id: "s2", label: "Apr 10", fromPage: 20, toPage: 50, minutes: 42 },
    ],
    thoughts: [],
  },
  {
    id: "the-hobbit",
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    genres: ["Fantasy", "Classic", "Adventure"],
    rating: 5,
    totalPages: 310,
    currentPage: 32,
    status: "reading",
    startedAt: "Apr 12",
    sessions: [
      { id: "s1", label: "Apr 13", fromPage: 10, toPage: 32, minutes: 30 },
    ],
    thoughts: [],
  },
  {
    id: "the-lord-of-the-rings",
    name: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    year: 1954,
    genres: ["Fantasy", "Epic"],
    rating: 5,
    totalPages: 1000,
    currentPage: 100,
    status: "reading",
    startedAt: "Mar 10",
    sessions: [
      { id: "s1", label: "Apr 16", fromPage: 70, toPage: 100, minutes: 55 },
    ],
    thoughts: [],
  },
  {
    id: "to-kill-a-mockingbird",
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genres: ["Classic", "Drama"],
    rating: 5,
    totalPages: 281,
    currentPage: 281,
    status: "finished",
    finishedAgo: "2 weeks ago",
    sessions: [],
    thoughts: [],
  },
  {
    id: "the-catcher-in-the-rye",
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
    genres: ["Classic", "Coming-of-age"],
    rating: 3,
    totalPages: 234,
    currentPage: 234,
    status: "finished",
    finishedAgo: "last month",
    sessions: [],
    thoughts: [],
  },
];

export const getProgressPercent = (current: number, total: number): number =>
  Math.min(100, Math.round((current / total) * 100));
