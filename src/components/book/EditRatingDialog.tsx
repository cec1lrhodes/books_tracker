import { Star } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { useSetBookRating } from "@/store/useLibrary"

import FormDialog from "../layout/FormDialog"

type EditRatingDialogProps = {
  onClose: () => void
  bookId: string
  initialRating: number
}

const MAX_RATING = 5
const TITLE_ID = "edit-rating-title"

const EditRatingDialog = ({
  onClose,
  bookId,
  initialRating,
}: EditRatingDialogProps) => {
  const setBookRating = useSetBookRating()
  const [rating, setRating] = useState(initialRating)

  const handleSelect = (value: number) => setRating(value)

  const handleSubmit = () => {
    setBookRating(bookId, rating)
    onClose()
  }

  return (
    <FormDialog
      title="Rate this book"
      titleId={TITLE_ID}
      ariaLabel="Close rating dialog"
      isValid
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div
        role="radiogroup"
        aria-label="Star rating"
        className="flex items-center justify-center gap-2 py-2"
      >
        {Array.from({ length: MAX_RATING }).map((_, index) => {
          const value = index + 1
          const isFilled = value <= rating
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isFilled}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => handleSelect(value)}
              className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                className={cn(
                  "h-8 w-8",
                  isFilled
                    ? "fill-white text-white"
                    : "text-muted-foreground",
                )}
              />
            </button>
          )
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {rating} / {MAX_RATING}
      </p>
    </FormDialog>
  )
}

export default EditRatingDialog
