export const GENRES = [
  "Classic",
  "Fantasy",
  "Fiction",
  "Novel",
  "Dystopia",
  "Political",
  "Adventure",
  "Epic",
  "Drama",
  "Coming-of-age",
  "Mystery",
  "Thriller",
  "Romance",
  "Science Fiction",
  "Historical",
  "Biography",
  "Non-fiction",
  "Poetry",
  "Horror",
  "Young Adult",
] as const

export type Genre = (typeof GENRES)[number]
