import { type Genre } from "@/data/genres";
import { type ExploreBook } from "@/types/explore";

type OpenLibraryAuthor = {
  name?: string;
};

type OpenLibraryWork = {
  key?: string;
  title?: string;
  authors?: OpenLibraryAuthor[];
  cover_id?: number;
  first_publish_year?: number;
};

type OpenLibrarySubjectResponse = {
  works?: OpenLibraryWork[];
};

const genreSubjects: Record<Genre, string> = {
  Classic: "classic_literature",
  Fantasy: "fantasy",
  Fiction: "fiction",
  Novel: "novels",
  Dystopia: "dystopian",
  Political: "politics",
  Adventure: "adventure",
  Epic: "epic",
  Drama: "drama",
  "Coming-of-age": "coming_of_age",
  Mystery: "mystery",
  Thriller: "thriller",
  Romance: "romance",
  "Science Fiction": "science_fiction",
  Historical: "historical_fiction",
  Biography: "biography",
  "Non-fiction": "nonfiction",
  Poetry: "poetry",
  Horror: "horror",
  "Young Adult": "young_adult",
};

const getOpenLibrarySubjectUrl = (subject: string) =>
  `https://openlibrary.org/subjects/${subject}.json?limit=18`;

const getCoverUrl = (coverId: number | undefined) => {
  if (!coverId) return undefined;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
};

const getWorkUrl = (key: string | undefined) => {
  if (!key) return "https://openlibrary.org";
  return `https://openlibrary.org${key}`;
};

const mapOpenLibraryWork = (work: OpenLibraryWork): ExploreBook | undefined => {
  if (!work.key || !work.title) return undefined;

  return {
    id: work.key,
    title: work.title,
    author:
      work.authors
        ?.map((author) => author.name)
        .filter(Boolean)
        .join(", ") || "Unknown author",
    year: work.first_publish_year,
    coverImage: getCoverUrl(work.cover_id),
    openLibraryUrl: getWorkUrl(work.key),
  };
};

const shuffleBooks = (books: ExploreBook[]) =>
  [...books].sort(() => Math.random() - 0.5);

export const fetchOpenLibraryBooksByGenres = async (
  genres: Genre[],
  signal: AbortSignal,
) => {
  const responses = await Promise.all(
    genres.map((genre) =>
      fetch(getOpenLibrarySubjectUrl(genreSubjects[genre]), {
        signal,
      }),
    ),
  );

  const failedResponse = responses.find((response) => !response.ok);

  if (failedResponse) {
    throw new Error("Open Library request failed");
  }

  const data = (await Promise.all(
    responses.map((response) => response.json()),
  )) as OpenLibrarySubjectResponse[];

  const nextBooks = data
    .flatMap((subject) => subject.works ?? [])
    .map(mapOpenLibraryWork)
    .filter((book): book is ExploreBook => Boolean(book));

  const uniqueBooks = Array.from(
    new Map(nextBooks.map((book) => [book.id, book])).values(),
  );

  return shuffleBooks(uniqueBooks).slice(0, 12);
};
