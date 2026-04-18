import { X } from "lucide-react"
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export type NewBookInput = {
  name: string
  author: string
  totalPages: number
}

type AddBookDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (book: NewBookInput) => void
}

const AddBookDialog = ({ open, onClose, onSubmit }: AddBookDialogProps) => {
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [pages, setPages] = useState("")

  useEffect(() => {
    if (!open) return
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setName("")
    setAuthor("")
    setPages("")
  }, [open])

  if (!open) return null

  const totalPages = Number.parseInt(pages, 10)
  const isValid =
    name.trim().length > 0 &&
    author.trim().length > 0 &&
    Number.isFinite(totalPages) &&
    totalPages > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return
    onSubmit({
      name: name.trim(),
      author: author.trim(),
      totalPages,
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
      aria-label="Close add book dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-book-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="add-book-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Add new book
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
                placeholder="The Great Gatsby"
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
                placeholder="F. Scott Fitzgerald"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Total pages
              </span>
              <Input
                value={pages}
                onChange={(event) => setPages(event.target.value)}
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="320"
                required
              />
            </label>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Add book
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>,
    document.body,
  )
}

export default AddBookDialog
