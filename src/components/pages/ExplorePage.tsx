import { useMemo, useState } from "react"

import ExploreBooksSection from "@/components/explore/ExploreBooksSection"
import ExploreTabs from "@/components/explore/ExploreTabs"
import GenreSelectorCard from "@/components/explore/GenreSelectorCard"
import BottomNav from "@/components/layout/BottomNav"
import { GENRES, type Genre } from "@/data/genres"
import { useExploreBooks } from "@/hooks/useExploreBooks"
import { useBooks } from "@/store/useLibrary"
import { type ExploreFilter } from "@/types/explore"

const getRandomGenre = () =>
  GENRES[Math.floor(Math.random() * GENRES.length)]

const sessionRandomGenre = getRandomGenre()

const ExplorePage = () => {
  const libraryBooks = useBooks()
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>("recommendation")
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [allGenre] = useState<Genre>(sessionRandomGenre)

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
  const {
    books,
    isLoading,
    isLoadingMore,
    errorMessage,
    hasMore,
    loadMore,
  } = useExploreBooks(activeGenres)

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

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Explore
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Discover books from Open Library by your favorite genres.
        </p>

        <ExploreTabs
          activeFilter={activeFilter}
          onChange={handleFilterChange}
        />

        {activeFilter === "genre" && (
          <GenreSelectorCard
            selectedGenres={selectedGenres}
            onToggleGenre={handleToggleGenre}
          />
        )}

        <ExploreBooksSection
          title={sectionTitle}
          books={books}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          errorMessage={errorMessage}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>

      <BottomNav />
    </div>
  )
}

export default ExplorePage
