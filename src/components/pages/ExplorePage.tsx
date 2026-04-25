import { Check, ExternalLink } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import BookCover from "@/components/layout/BookCover"
import BottomNav from "@/components/layout/BottomNav"
import SectionHeading from "@/components/layout/SectionHeading"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GENRES, type Genre } from "@/data/genres"
import { cn } from "@/lib/utils"
import { useBooks } from "@/store/useLibrary"

type ExploreFilter = "recommendation" | "all" | "genre"

type OpenLibraryAuthor = {
  name?: string
}

type OpenLibraryWork = {
  key?: string
  title?: string
  authors?: OpenLibraryAuthor[]
  cover_id?: number
  first_publish_year?: number
}

type OpenLibrarySubjectResponse = {
  works?: OpenLibraryWork[]
}

type ExploreBook = {
  id: string
  title: string
  author: string
  year?: number
  coverImage?: string
  openLibraryUrl: string
}

const filterTabs: { value: ExploreFilter; label: string }[] = [
  { value: "recommendation", label: "My Recommendation" },
  { value: "all", label: "All" },
  { value: "genre", label: "Select genre" },
]

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
}

const getOpenLibrarySubjectUrl = (subject: string) =>
  `https://openlibrary.org/subjects/${subject}.json?limit=18`

const getCoverUrl = (coverId: number | undefined) => {
  if (!coverId) return undefined
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
}

const getWorkUrl = (key: string | undefined) => {
  if (!key) return "https://openlibrary.org"
  return `https://openlibrary.org${key}`
}

const mapOpenLibraryWork = (work: OpenLibraryWork): ExploreBook | undefined => {
  if (!work.key || !work.title) return undefined

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
  }
}

const shuffleBooks = (books: ExploreBook[]) =>
  [...books].sort(() => Math.random() - 0.5)

const getRandomGenre = () =>
  GENRES[Math.floor(Math.random() * GENRES.length)]

const ExplorePage = () => {
  const libraryBooks = useBooks()
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>("recommendation")
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [books, setBooks] = useState<ExploreBook[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [allGenre] = useState<Genre>(getRandomGenre)

  const recommendedGenre = useMemo(() => {
    const genreScores = libraryBooks.reduce<Record<string, number>>((scores, book) => {
      book.genres.forEach((genre) => {
        scores[genre] = (scores[genre] ?? 0) + 1 + book.rating * 0.2
      })

      return scores
    }, {})

    const [bestGenre] =
      Object.entries(genreScores).sort(([, firstScore], [, secondScore]) => secondScore - firstScore)[0] ?? []

    if (bestGenre && GENRES.includes(bestGenre as Genre)) {
      return bestGenre as Genre
    }

    return allGenre
  }, [allGenre, libraryBooks])

  const activeGenres = useMemo(() => {
    if (activeFilter === "recommendation") return [recommendedGenre]
    if (activeFilter === "all") return [allGenre]
    return selectedGenres
  }, [activeFilter, allGenre, recommendedGenre, selectedGenres])

  const sectionTitle = useMemo(() => {
    if (activeFilter === "recommendation") {
      return `Because you read ${recommendedGenre}`
    }

    if (activeFilter === "all") {
      return "Random books"
    }

    if (selectedGenres.length === 0) {
      return "Choose genres"
    }

    return selectedGenres.join(", ")
  }, [activeFilter, recommendedGenre, selectedGenres])

  const handleFilterChange = (value: string) =>
    setActiveFilter(value as ExploreFilter)

  const handleToggleGenre = (genre: Genre) =>
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    )

  useEffect(() => {
    if (activeFilter === "genre" && activeGenres.length === 0) {
      setBooks([])
      setErrorMessage("")
      return
    }

    const controller = new AbortController()

    const fetchBooks = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const responses = await Promise.all(
          activeGenres.map((genre) =>
            fetch(getOpenLibrarySubjectUrl(genreSubjects[genre]), {
              signal: controller.signal,
            }),
          ),
        )

        const failedResponse = responses.find((response) => !response.ok)

        if (failedResponse) {
          throw new Error("Open Library request failed")
        }

        const data = (await Promise.all(
          responses.map((response) => response.json()),
        )) as OpenLibrarySubjectResponse[]

        const nextBooks = data
          .flatMap((subject) => subject.works ?? [])
          .map(mapOpenLibraryWork)
          .filter((book): book is ExploreBook => Boolean(book))

        const uniqueBooks = Array.from(
          new Map(nextBooks.map((book) => [book.id, book])).values(),
        )

        setBooks(shuffleBooks(uniqueBooks).slice(0, 12))
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return

        setErrorMessage("Could not load books from Open Library. Try again later.")
        setBooks([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchBooks()

    return () => controller.abort()
  }, [activeFilter, activeGenres])

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Explore
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Discover books from Open Library by your favorite genres.
        </p>

        <Tabs
          value={activeFilter}
          onValueChange={handleFilterChange}
          className="w-full"
        >
          <TabsList className="w-full">
            {filterTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeFilter === "genre" && (
          <Card className="mt-4">
            <CardContent>
              <p className="mb-3 text-sm font-medium text-foreground">
                Select genres
              </p>
              <ul className="flex max-h-72 flex-wrap gap-2 overflow-y-auto">
                {GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre)

                  return (
                    <li key={genre}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleToggleGenre(genre)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground hover:bg-accent",
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        )}
                        {genre}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        <section aria-labelledby="explore-books" className="mt-5">
          <SectionHeading id="explore-books" className="mb-2">
            {sectionTitle}
          </SectionHeading>

          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading books...</p>
          )}

          {!isLoading && errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && books.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Select at least one genre to discover books.
            </p>
          )}

          {!isLoading && !errorMessage && books.length > 0 && (
            <ul className="flex flex-col gap-3">
              {books.map((book) => (
                <li key={book.id}>
                  <a
                    href={book.openLibraryUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${book.title} on Open Library`}
                    className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Card>
                      <CardContent className="flex items-center gap-3">
                        <BookCover
                          className="h-20 w-14"
                          src={book.coverImage}
                          alt={`${book.title} cover`}
                          showPlaceholderIcon
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <p className="truncate text-base font-semibold text-foreground">
                            {book.title}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {book.year
                              ? `${book.author} · ${book.year}`
                              : book.author}
                          </p>
                        </div>
                        <ExternalLink
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </CardContent>
                    </Card>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

export default ExplorePage
