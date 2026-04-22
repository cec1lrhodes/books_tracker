import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useAddReadingSession } from "@/store/useLibrary";

import FormDialog from "./FormDialog";

type UpdateProgressDialogProps = {
  onClose: () => void;
  bookId: string;
  currentPage: number;
  totalPages: number;
};

const TITLE_ID = "update-progress-title";

const UpdateProgressDialog = ({
  onClose,
  bookId,
  currentPage,
  totalPages,
}: UpdateProgressDialogProps) => {
  const addReadingSession = useAddReadingSession();
  const [pages, setPages] = useState("");

  const remaining = Math.max(0, totalPages - currentPage);
  const pagesRead = Number.parseInt(pages, 10);

  const isValid =
    Number.isFinite(pagesRead) && pagesRead > 0 && pagesRead <= remaining;

  const handleSubmit = () => {
    addReadingSession(bookId, pagesRead);
    onClose();
  };

  return (
    <FormDialog
      title="Update progress"
      titleId={TITLE_ID}
      ariaLabel="Close update progress dialog"
      description={`On page ${currentPage} of ${totalPages} · ${remaining} left`}
      isValid={isValid}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
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
    </FormDialog>
  );
};

export default UpdateProgressDialog;
