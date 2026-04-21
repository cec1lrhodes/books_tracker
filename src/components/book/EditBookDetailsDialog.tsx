import { X } from "lucide-react"
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUpdateBookDetails } from "@/store/useLibrary"

type EditBookDetailsDialogProps = {
  onClose: () => void
  bookId: string
  initialName: string
  initialAuthor: string
  initialTotalPages: number
}

const EditBookDetailsDialog = ({
  onClose,
  bookId,
  initialName,
  initialAuthor,
  initialTotalPages,
}: EditBookDetailsDialogProps) => {
  const updateBookDetails = useUpdateBookDetails()
  const [name, setName] = useState(initialName)
  const [author, setAuthor] = useState(initialAuthor)
  const [totalPages, setTotalPages] = useState(String(initialTotalPages))

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

  const parsedTotalPages = Number.parseInt(totalPages, 10)
  const isValid =
    name.trim().length > 0 &&
    author.trim().length > 0 &&
    Number.isFinite(parsedTotalPages) &&
    parsedTotalPages > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return
    updateBookDetails(bookId, {
      name,
      author,
      totalPages: parsedTotalPages,
    })
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
      aria-label="Close edit book dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-book-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="edit-book-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Edit book
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Title
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Book title"
                autoFocus
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Author
              </span>
              <Input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Author name"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Total pages
              </span>
              <Input
                value={totalPages}
                onChange={(event) => setTotalPages(event.target.value)}
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 320"
                required
              />
            </label>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>,
    document.body,
  )
}

export default EditBookDetailsDialog
