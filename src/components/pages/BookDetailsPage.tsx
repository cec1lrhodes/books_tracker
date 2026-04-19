import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

import BookCover from "@/components/book/BookCover"
import StarRating from "@/components/book/StarRating"
import BottomNav from "@/components/layout/BottomNav"
import PlaceholderPage from "@/components/pages/PlaceholderPage"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getProgressPercent } from "@/data/books"
import { useBookById } from "@/store/useLibrary"

type BookDetailsPageProps = {
  bookId: string
}

const BookDetailsPage = ({ bookId }: BookDetailsPageProps) => {
  const book = useBookById(bookId)

  if (!book) {
    return (
      <PlaceholderPage
        title="Book not found"
        description="We couldn't find this book in your library."
      />
    )
  }

  const percent = getProgressPercent(book.currentPage, book.totalPages)

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <header className="flex items-center px-4 pt-4">
        <Link
          to="/library"
          aria-label="Back to library"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-2">
        <section className="flex flex-col items-center text-center">
          <BookCover className="h-52 w-36" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            {book.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {book.author} · {book.year}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={book.rating} />
            <span className="text-sm text-muted-foreground">
              {book.rating.toFixed(1)}
            </span>
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {book.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
              >
                {genre}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="progress-heading" className="mt-8">
          <div className="flex items-center justify-between">
            <h2
              id="progress-heading"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Progress
            </h2>
            <span className="text-sm font-medium text-foreground">
              {book.currentPage} / {book.totalPages} pages
            </span>
          </div>
          <Progress value={percent} className="mt-3" />
          <div className="mt-2 flex items-center justify-between text-xs">
            {book.startedAt ? (
              <span className="text-muted-foreground">
                Started {book.startedAt}
              </span>
            ) : (
              <span />
            )}
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
        </section>

        <Button
          type="button"
          className="mt-6 h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          Update progress
        </Button>

        <section aria-labelledby="sessions-heading" className="mt-8">
          <h2
            id="sessions-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Reading sessions
          </h2>
          {book.sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {book.sessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between rounded-xl bg-card px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {session.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      pp. {session.fromPage} – {session.toPage}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.minutes} min
                  </span>
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

export default BookDetailsPage
