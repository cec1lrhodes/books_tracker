import { X } from "lucide-react";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAddThought } from "@/store/useLibrary";

type AddThoughtDialogProps = {
  onClose: () => void;
  bookId: string;
};

const AddThoughtDialog = ({ onClose, bookId }: AddThoughtDialogProps) => {
  const addThought = useAddThought();
  const [text, setText] = useState("");

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

  const isValid = text.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    addThought(bookId, text);
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
      aria-label="Close add thought dialog"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-thought-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id="add-thought-title"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Add a thought
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Thought
              </span>
              <Input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="What's on your mind?"
                autoFocus
                required
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

export default AddThoughtDialog;
