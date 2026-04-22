import { Check } from "lucide-react"
import { useState } from "react"

import { GENRES } from "@/data/genres"
import { cn } from "@/lib/utils"
import { useSetBookGenres } from "@/store/useLibrary"

import FormDialog from "../layout/FormDialog"

type EditGenresDialogProps = {
  onClose: () => void
  bookId: string
  initialGenres: string[]
}

const TITLE_ID = "edit-genres-title"

const EditGenresDialog = ({
  onClose,
  bookId,
  initialGenres,
}: EditGenresDialogProps) => {
  const setBookGenres = useSetBookGenres()
  const [selected, setSelected] = useState<string[]>(initialGenres)

  const handleToggle = (genre: string) =>
    setSelected((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    )

  const handleSubmit = () => {
    setBookGenres(bookId, selected)
    onClose()
  }

  return (
    <FormDialog
      title="Select genres"
      titleId={TITLE_ID}
      ariaLabel="Close genres dialog"
      isValid
      onClose={onClose}
      onSubmit={handleSubmit}
    >
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
    </FormDialog>
  )
}

export default EditGenresDialog
