import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"

import BookCover from "@/components/book/BookCover"
import StarRating from "@/components/book/StarRating"
import BottomNav from "@/components/layout/BottomNav"
import AddBookDialog from "@/components/library/AddBookDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getProgressPercent } from "@/data/books"
import { useBooks } from "@/store/useLibrary"

const LibraryPage = () => {
  const books = useBooks()
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleOpen = () => setIsAddOpen(true)
  const handleClose = () => setIsAddOpen(false)

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

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20">
        <div className="mx-auto flex w-full max-w-md justify-end px-4">
          <Button
            type="button"
            size="icon"
            aria-label="Add new book"
            onClick={handleOpen}
            className="pointer-events-auto size-11 rounded-xl border border-white/10 bg-card/80 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md hover:bg-card hover:border-white/20 [&_svg:not([class*='size-'])]:size-5"
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      <AddBookDialog open={isAddOpen} onClose={handleClose} />

      <BottomNav />
    </div>
  )
}

export default LibraryPage
