import { Star, X } from "lucide-react"
import { useEffect, useState, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSetBookRating } from "@/store/useLibrary"

type EditRatingDialogProps = {
  onClose: () => void
  bookId: string
  initialRating: number
}

const MAX_RATING = 5

const EditRatingDialog = ({
  onClose,
  bookId,
  initialRating,
}: EditRatingDialogProps) => {
  const setBookRating = useSetBookRating()
  const [rating, setRating] = useState(initialRating)

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleSelect = (value: number) => setRating(value)

  const handleSave = () => {
    setBookRating(bookId, rating)
    onClose()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClose()
    }
  }

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label="Close rating dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-rating-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="edit-rating-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Rate this book
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

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

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body,
  )
}

export default EditRatingDialog
