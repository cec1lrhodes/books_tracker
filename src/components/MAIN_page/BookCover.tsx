import { cn } from "@/lib/utils";

type BookCoverProps = {
  className?: string;
};

const BookCover = ({ className }: BookCoverProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "shrink-0 rounded-md bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-inner",
      className,
    )}
  />
);

export default BookCover;
