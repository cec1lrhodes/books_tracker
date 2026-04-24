import { useState } from "react"

import BookCover from "@/components/layout/BookCover"
import { Input } from "@/components/ui/input"
import { useImagePicker } from "@/hooks/useImagePicker"

import FormDialog from "./FormDialog"

export type BookFormValues = {
  name: string
  author: string
  totalPages: number
  coverImage?: string
}

type BookFormInitialValues = {
  name?: string
  author?: string
  totalPages?: number
  coverImage?: string
}

type BookFormPlaceholders = {
  name?: string
  author?: string
  totalPages?: string
}

type AddAndEditBookDialogProps = {
  title: string
  submitLabel: string
  ariaLabelClose: string
  onClose: () => void
  onSubmit: (values: BookFormValues) => void
  initialValues?: BookFormInitialValues
  placeholders?: BookFormPlaceholders
  enableCover?: boolean
}

const DEFAULT_PLACEHOLDERS: Required<BookFormPlaceholders> = {
  name: "Book title",
  author: "Author name",
  totalPages: "e.g. 320",
}

const TITLE_ID = "add-and-edit-book-title"

const AddAndEditBookDialog = ({
  title,
  submitLabel,
  ariaLabelClose,
  onClose,
  onSubmit,
  initialValues,
  placeholders,
  enableCover = false,
}: AddAndEditBookDialogProps) => {
  const [name, setName] = useState(initialValues?.name ?? "")
  const [author, setAuthor] = useState(initialValues?.author ?? "")
  const [totalPages, setTotalPages] = useState(
    initialValues?.totalPages !== undefined
      ? String(initialValues.totalPages)
      : "",
  )
  const [coverImage, setCoverImage] = useState<string | undefined>(
    initialValues?.coverImage,
  )

  const { inputRef, error, handleOpenPicker, handleChange } = useImagePicker(
    (dataUrl) => setCoverImage(dataUrl),
  )

  const parsedTotalPages = Number.parseInt(totalPages, 10)

  const isValid =
    name.trim().length > 0 &&
    author.trim().length > 0 &&
    Number.isFinite(parsedTotalPages) &&
    parsedTotalPages > 0

  const resolvedPlaceholders = { ...DEFAULT_PLACEHOLDERS, ...placeholders }

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      author: author.trim(),
      totalPages: parsedTotalPages,
      coverImage,
    })
    onClose()
  }

  const handleCoverKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleOpenPicker()
    }
  }

  return (
    <FormDialog
      title={title}
      titleId={TITLE_ID}
      ariaLabel={ariaLabelClose}
      submitLabel={submitLabel}
      isValid={isValid}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {enableCover && (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenPicker}
            onKeyDown={handleCoverKeyDown}
            tabIndex={0}
            aria-label={coverImage ? "Change book cover" : "Add book cover"}
            className="rounded-md transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BookCover
              className="h-32 w-24"
              src={coverImage}
              alt="Book cover preview"
              showPlaceholderIcon
            />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          {error && (
            <span className="text-xs text-destructive">{error}</span>
          )}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Title
        </span>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={resolvedPlaceholders.name}
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
          placeholder={resolvedPlaceholders.author}
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
          placeholder={resolvedPlaceholders.totalPages}
          required
        />
      </label>
    </FormDialog>
  )
}

export default AddAndEditBookDialog
