import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import AddThoughtDialog from "@/components/book/AddThoughtDialog";
import BookActionsMenu from "@/components/book/BookActionsMenu";
import BookHeroSection from "@/components/book/BookHeroSection";
import BookProgressSection from "@/components/book/BookProgressSection";
import EditBookDetailsDialog from "@/components/book/EditBookDetailsDialog";
import EditGenresDialog from "@/components/book/EditGenresDialog";
import EditRatingDialog from "@/components/book/EditRatingDialog";
import ReadingSessionsSection from "@/components/book/ReadingSessionsSection";
import ThoughtsSection from "@/components/book/ThoughtsSection";
import UpdateProgressDialog from "@/components/book/UpdateProgressDialog";
import BottomNav from "@/components/layout/BottomNav";
import PlaceholderPage from "@/components/pages/PlaceholderPage";
import { Button } from "@/components/ui/button";
import { useImagePicker } from "@/hooks/useImagePicker";
import {
  useBookById,
  useDeleteBook,
  useSetBookCover,
} from "@/store/useLibrary";

type BookDetailsPageProps = {
  bookId: string;
};

const BookDetailsPage = ({ bookId }: BookDetailsPageProps) => {
  const book = useBookById(bookId);
  const deleteBook = useDeleteBook();
  const setBookCover = useSetBookCover();
  const navigate = useNavigate();
  const { inputRef, handleOpenPicker, handleChange } = useImagePicker(
    (dataUrl) => setBookCover(bookId, dataUrl),
  );
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isThoughtOpen, setIsThoughtOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  const handleOpenUpdate = () => setIsUpdateOpen(true);
  const handleCloseUpdate = () => setIsUpdateOpen(false);
  const handleOpenThought = () => setIsThoughtOpen(true);
  const handleCloseThought = () => setIsThoughtOpen(false);
  const handleOpenEdit = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);
  const handleOpenRating = () => setIsRatingOpen(true);
  const handleCloseRating = () => setIsRatingOpen(false);
  const handleOpenGenres = () => setIsGenresOpen(true);
  const handleCloseGenres = () => setIsGenresOpen(false);
  const handleDelete = () => {
    deleteBook(bookId);
    navigate({ to: "/library" });
  };
  const handleRemoveCover = () => setBookCover(bookId, undefined);

  if (!book) {
    return (
      <PlaceholderPage
        title="Book not found"
        description="We couldn't find this book in your library."
      />
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <header className="flex items-center justify-between px-4 pt-4">
        <Link
          to="/library"
          aria-label="Back to library"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>

        <BookActionsMenu
          hasCover={Boolean(book.coverImage)}
          onEdit={handleOpenEdit}
          onChangeCover={handleOpenPicker}
          onRemoveCover={handleRemoveCover}
          onRate={handleOpenRating}
          onChangeGenres={handleOpenGenres}
          onDelete={handleDelete}
        />
      </header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <main className="flex-1 overflow-y-auto px-4 pt-2">
        <BookHeroSection book={book} />

        <BookProgressSection book={book} />

        <Button
          type="button"
          onClick={handleOpenUpdate}
          disabled={book.currentPage >= book.totalPages}
          className="mt-6 h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          Update progress
        </Button>

        <Button
          type="button"
          onClick={handleOpenThought}
          className="mt-3 h-12 w-full rounded-xl border border-border bg-card text-foreground hover:bg-accent"
        >
          Add thought
        </Button>

        <ReadingSessionsSection sessions={book.sessions} />

        <ThoughtsSection thoughts={book.thoughts} />
      </main>

      {isUpdateOpen && (
        <UpdateProgressDialog
          onClose={handleCloseUpdate}
          bookId={book.id}
          currentPage={book.currentPage}
          totalPages={book.totalPages}
        />
      )}

      {isThoughtOpen && (
        <AddThoughtDialog onClose={handleCloseThought} bookId={book.id} />
      )}

      {isEditOpen && (
        <EditBookDetailsDialog
          onClose={handleCloseEdit}
          bookId={book.id}
          initialName={book.name}
          initialAuthor={book.author}
          initialTotalPages={book.totalPages}
        />
      )}

      {isRatingOpen && (
        <EditRatingDialog
          onClose={handleCloseRating}
          bookId={book.id}
          initialRating={book.rating}
        />
      )}

      {isGenresOpen && (
        <EditGenresDialog
          onClose={handleCloseGenres}
          bookId={book.id}
          initialGenres={book.genres}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default BookDetailsPage;
