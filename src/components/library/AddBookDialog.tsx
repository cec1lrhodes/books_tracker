import AddAndEditBookDialog, {
  type BookFormValues,
} from "@/components/layout/AddAndEditBookDialog";
import { useAddBook } from "@/store/useLibrary";

type AddBookDialogProps = {
  onClose: () => void;
};

const AddBookDialog = ({ onClose }: AddBookDialogProps) => {
  const addBook = useAddBook();

  const handleSubmit = (values: BookFormValues) => {
    addBook(values);
  };

  return (
    <AddAndEditBookDialog
      title="Add new book"
      submitLabel="Add book"
      ariaLabelClose="Close add book dialog"
      onClose={onClose}
      onSubmit={handleSubmit}
      enableCover
      placeholders={{
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        totalPages: "320",
      }}
    />
  );
};

export default AddBookDialog;
