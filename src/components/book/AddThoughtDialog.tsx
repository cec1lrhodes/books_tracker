import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useAddThought } from "@/store/useLibrary";

import FormDialog from "../layout/FormDialog";

type AddThoughtDialogProps = {
  onClose: () => void;
  bookId: string;
};

const TITLE_ID = "add-thought-title";

const AddThoughtDialog = ({ onClose, bookId }: AddThoughtDialogProps) => {
  const addThought = useAddThought();
  const [text, setText] = useState("");

  const isValid = text.trim().length > 0;

  const handleSubmit = () => {
    addThought(bookId, text);
    onClose();
  };

  return (
    <FormDialog
      title="Add a thought"
      titleId={TITLE_ID}
      ariaLabel="Close add thought dialog"
      isValid={isValid}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
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
    </FormDialog>
  );
};

export default AddThoughtDialog;
