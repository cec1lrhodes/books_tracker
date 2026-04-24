import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import BookCover from "@/components/layout/BookCover";
import { Card, CardContent } from "@/components/ui/card";
import type { Book } from "@/data/books";

type BookListItemProps = {
  book: Book;
  subtitle: ReactNode;
  extra?: ReactNode;
  trailing?: ReactNode;
};

const BookListItem = ({
  book,
  subtitle,
  extra,
  trailing,
}: BookListItemProps) => (
  <li>
    <Link
      to="/library/$bookId"
      params={{ bookId: book.id }}
      aria-label={`Open ${book.name}`}
      className="block rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card>
        <CardContent className="flex items-center gap-3">
          <BookCover
            className="h-20 w-14"
            src={book.coverImage}
            alt={`${book.name} cover`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-base font-semibold text-foreground">
              {book.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            {extra}
          </div>
          {trailing}
        </CardContent>
      </Card>
    </Link>
  </li>
);

export default BookListItem;
