import { ExternalLink } from "lucide-react";

import BookCover from "@/components/layout/BookCover";
import { Card, CardContent } from "@/components/ui/card";
import { type ExploreBook } from "@/types/explore";

type ExploreBookCardProps = {
  book: ExploreBook;
};

const ExploreBookCard = ({ book }: ExploreBookCardProps) => (
  <li>
    <a
      href={book.openLibraryUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${book.title} on Open Library`}
      className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card>
        <CardContent className="flex items-center gap-3">
          <BookCover
            className="h-20 w-14"
            src={book.coverImage}
            alt={`${book.title} cover`}
            showPlaceholderIcon
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-base font-semibold text-foreground">
              {book.title}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {book.year ? `${book.author} · ${book.year}` : book.author}
            </p>
          </div>
          <ExternalLink
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </CardContent>
      </Card>
    </a>
  </li>
);

export default ExploreBookCard;
