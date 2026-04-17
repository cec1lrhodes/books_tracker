import { Link } from "@tanstack/react-router"

import BookCover from "@/components/book/BookCover"
import StarRating from "@/components/book/StarRating"
import BottomNav from "@/components/layout/BottomNav"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { books, getProgressPercent } from "@/data/books"

const LibraryPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
          Library
        </h1>
        <ul className="flex flex-col gap-3">
          {books.map((book) => {
            const percent = getProgressPercent(
              book.currentPage,
              book.totalPages,
            )
            return (
              <li key={book.id}>
                <Link
                  to="/library/$bookId"
                  params={{ bookId: book.id }}
                  aria-label={`Open ${book.name}`}
                  className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Card>
                    <CardContent className="flex items-center gap-3">
                      <BookCover className="h-20 w-14" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-base font-semibold text-foreground">
                          {book.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {book.author} · {book.year}
                        </p>
                        {book.status === "reading" ? (
                          <div className="mt-1 flex items-center gap-2">
                            <Progress value={percent} className="flex-1" />
                            <span className="text-xs font-medium text-foreground">
                              {percent}%
                            </span>
                          </div>
                        ) : (
                          <StarRating value={book.rating} className="mt-1" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>

      <BottomNav />
    </div>
  )
}

export default LibraryPage
