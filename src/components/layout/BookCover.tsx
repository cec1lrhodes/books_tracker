import { BookImage } from "lucide-react"

import { cn } from "@/lib/utils"

type BookCoverProps = {
  className?: string
  src?: string
  alt?: string
  showPlaceholderIcon?: boolean
}

const BookCover = ({
  className,
  src,
  alt,
  showPlaceholderIcon = false,
}: BookCoverProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className={cn(
          "shrink-0 rounded-md object-cover shadow-inner",
          className,
        )}
      />
    )
  }

  return (
    <div
      aria-hidden={showPlaceholderIcon ? undefined : "true"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-200 to-zinc-500 shadow-inner",
        className,
      )}
    >
      {showPlaceholderIcon && (
        <BookImage
          className="h-1/3 w-1/3 text-white/70"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default BookCover
