import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { GENRES, type Genre } from "@/data/genres";
import { cn } from "@/lib/utils";

type GenreSelectorCardProps = {
  selectedGenres: Genre[];
  onToggleGenre: (genre: Genre) => void;
};

const GenreSelectorCard = ({
  selectedGenres,
  onToggleGenre,
}: GenreSelectorCardProps) => (
  <Card className="mt-4">
    <CardContent>
      <p className="mb-3 text-sm font-medium text-foreground">Select genres</p>
      <ul className="flex max-h-72 flex-wrap gap-2 overflow-y-auto">
        {GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre);

          return (
            <li key={genre}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleGenre(genre)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-accent",
                )}
              >
                {isSelected && <Check className="h-3 w-3" aria-hidden="true" />}
                {genre}
              </button>
            </li>
          );
        })}
      </ul>
    </CardContent>
  </Card>
);

export default GenreSelectorCard;
