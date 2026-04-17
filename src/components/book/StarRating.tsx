import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

type StarRatingProps = {
  value: number
  max?: number
  className?: string
}

const StarRating = ({ value, max = 5, className }: StarRatingProps) => (
  <div
    role="img"
    aria-label={`Rating ${value} out of ${max}`}
    className={cn("flex items-center gap-0.5", className)}
  >
    {Array.from({ length: max }).map((_, index) => {
      const isFilled = index < value
      return (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            isFilled ? "fill-white text-white" : "text-muted-foreground",
          )}
        />
      )
    })}
  </div>
)

export default StarRating
