import { X } from "lucide-react";
import {
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FormDialogProps = {
  title: string;
  titleId: string;
  ariaLabel: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  isValid: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

const FormDialog = ({
  title,
  titleId,
  ariaLabel,
  description,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isValid,
  onClose,
  onSubmit,
  children,
}: FormDialogProps) => {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    onSubmit();
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
      aria-label={ariaLabel}
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-md"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm border border-border shadow-xl"
      >
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {title}
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

          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {children}

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={!isValid}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>,
    document.body,
  );
};

export default FormDialog;
