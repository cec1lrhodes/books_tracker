import { createFileRoute } from "@tanstack/react-router"

import BookDetailsPage from "@/components/pages/BookDetailsPage"

const BookDetailsRoute = () => {
  const { bookId } = Route.useParams()
  return <BookDetailsPage bookId={bookId} />
}

export const Route = createFileRoute("/library/$bookId")({
  component: BookDetailsRoute,
})
