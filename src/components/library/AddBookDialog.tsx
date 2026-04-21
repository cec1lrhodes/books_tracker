import AddAndEditBookDialog from "@/components/book/AddAndEditBookDialog";
import { useAddBook } from "@/store/useLibrary";

type AddBookDialogProps = {
  onClose: () => void;
};

const AddBookDialog = ({ onClose }: AddBookDialogProps) => {
  const addBook = useAddBook();

  const handleSubmit = (values: {
    name: string;
    author: string;
    totalPages: number;
  }) => {
    addBook(values);
  };

  return (
    <AddAndEditBookDialog
      title="Add new book"
      submitLabel="Add book"
      ariaLabelClose="Close add book dialog"
      onClose={onClose}
      onSubmit={handleSubmit}
      placeholders={{
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        totalPages: "320",
      }}
    />
  );
};

export default AddBookDialog;
