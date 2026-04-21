import { Check, X } from "lucide-react"
import { useEffect, useState, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GENRES } from "@/data/genres"
import { cn } from "@/lib/utils"
import { useSetBookGenres } from "@/store/useLibrary"

type EditGenresDialogProps = {
  onClose: () => void
  bookId: string
  initialGenres: string[]
}

const EditGenresDialog = ({
  onClose,
  bookId,
  initialGenres,
}: EditGenresDialogProps) => {
  const setBookGenres = useSetBookGenres()
  const [selected, setSelected] = useState<string[]>(initialGenres)

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

  const handleToggle = (genre: string) =>
    setSelected((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    )

  const handleSave = () => {
    setBookGenres(bookId, selected)
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
      aria-label="Close genres dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-genres-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="edit-genres-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Select genres
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

          <ul className="flex max-h-72 flex-wrap gap-2 overflow-y-auto">
            {GENRES.map((genre) => {
              const isSelected = selected.includes(genre)
              return (
                <li key={genre}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleToggle(genre)}
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

export default EditGenresDialog
