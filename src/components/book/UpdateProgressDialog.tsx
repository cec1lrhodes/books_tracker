import { X } from "lucide-react";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAddReadingSession } from "@/store/useLibrary";

type UpdateProgressDialogProps = {
  onClose: () => void;
  bookId: string;
  currentPage: number;
  totalPages: number;
};

const UpdateProgressDialog = ({
  onClose,
  bookId,
  currentPage,
  totalPages,
}: UpdateProgressDialogProps) => {
  const addReadingSession = useAddReadingSession();
  const [pages, setPages] = useState("");

  const remaining = Math.max(0, totalPages - currentPage);

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const pagesRead = Number.parseInt(pages, 10);
  const isValid =
    Number.isFinite(pagesRead) && pagesRead > 0 && pagesRead <= remaining;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    addReadingSession(bookId, pagesRead);
    onClose();
  };

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose();
    }
  };

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label="Close update progress dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-progress-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="update-progress-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Update progress
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            On page {currentPage} of {totalPages} · {remaining} left
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Pages read
              </span>
              <Input
                value={pages}
                onChange={(event) => setPages(event.target.value)}
                type="number"
                inputMode="numeric"
                min={1}
                max={remaining}
                placeholder="e.g. 12"
                autoFocus
                required
                disabled={remaining === 0}
              />
            </label>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>,
    document.body,
  );
};

export default UpdateProgressDialog;
