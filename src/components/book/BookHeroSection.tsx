import BookCover from "@/components/layout/BookCover";
import StarRating from "@/components/layout/StarRating";
import type { Book } from "@/data/books";

type BookHeroSectionProps = {
  book: Book;
};

const BookHeroSection = ({ book }: BookHeroSectionProps) => (
  <section className="flex flex-col items-center text-center">
    <BookCover
      className="h-52 w-36"
      src={book.coverImage}
      alt={`${book.name} cover`}
      showPlaceholderIcon
    />
    <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
      {book.name}
    </h1>
    <p className="mt-1 text-sm text-muted-foreground">
      {book.author} · {book.year}
    </p>
    <div className="mt-3 flex items-center gap-2">
      <StarRating value={book.rating} />
      <span className="text-sm text-muted-foreground">
        {book.rating.toFixed(1)}
      </span>
    </div>
    <ul className="mt-4 flex flex-wrap justify-center gap-2">
      {book.genres.map((genre) => (
        <li
          key={genre}
          className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
        >
          {genre}
        </li>
      ))}
    </ul>
  </section>
);

export default BookHeroSection;
