import { createFileRoute } from "@tanstack/react-router"

import BookDetailsPage from "@/components/pages/BookDetailsPage"
import PlaceholderPage from "@/components/pages/PlaceholderPage"
import { getBookById } from "@/data/books"

const BookDetailsRoute = () => {
  const { bookId } = Route.useParams()
  const book = getBookById(bookId)

  if (!book) {
    return (
      <PlaceholderPage
        title="Book not found"
        description="We couldn't find this book in your library."
      />
    )
  }

  return <BookDetailsPage book={book} />
}

export const Route = createFileRoute("/library/$bookId")({
  component: BookDetailsRoute,
})
