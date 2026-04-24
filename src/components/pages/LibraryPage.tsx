import { Plus } from "lucide-react";
import { useState } from "react";

import BookListItem from "@/components/layout/BookListItem";
import BottomNav from "@/components/layout/BottomNav";
import ReadingProgress from "@/components/layout/ReadingProgress";
import StarRating from "@/components/layout/StarRating";
import AddBookDialog from "@/components/library/AddBookDialog";
import { Button } from "@/components/ui/button";
import { type Book } from "@/data/books";
import { useBooks } from "@/store/useLibrary";

const renderBookExtra = (book: Book) => {
  if (book.status === "reading") {
    return (
      <ReadingProgress
        currentPage={book.currentPage}
        totalPages={book.totalPages}
        className="mt-1"
      />
    );
  }
  return <StarRating value={book.rating} className="mt-1" />;
};

const renderLibraryBookItem = (book: Book) => (
  <BookListItem
    key={book.id}
    book={book}
    subtitle={`${book.author} · ${book.year}`}
    extra={renderBookExtra(book)}
  />
);

const LibraryPage = () => {
  const books = useBooks();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOpen = () => setIsAddOpen(true);
  const handleClose = () => setIsAddOpen(false);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
          Library
        </h1>
        <ul className="flex flex-col gap-3">
          {books.map(renderLibraryBookItem)}
        </ul>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20">
        <div className="mx-auto flex w-full max-w-md justify-end px-4">
          <Button
            type="button"
            size="icon"
            aria-label="Add new book"
            onClick={handleOpen}
            className="pointer-events-auto size-11 rounded-xl border border-white/10 bg-card/80 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md hover:bg-card hover:border-white/20 [&_svg:not([class*='size-'])]:size-5"
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isAddOpen && <AddBookDialog onClose={handleClose} />}

      <BottomNav />
    </div>
  );
};

export default LibraryPage;
