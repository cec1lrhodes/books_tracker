import AddAndEditBookDialog from "@/components/book/AddAndEditBookDialog";
import { useUpdateBookDetails } from "@/store/useLibrary";

type EditBookDetailsDialogProps = {
  onClose: () => void;
  bookId: string;
  initialName: string;
  initialAuthor: string;
  initialTotalPages: number;
};

const EditBookDetailsDialog = ({
  onClose,
  bookId,
  initialName,
  initialAuthor,
  initialTotalPages,
}: EditBookDetailsDialogProps) => {
  const updateBookDetails = useUpdateBookDetails();

  const handleSubmit = (values: {
    name: string;
    author: string;
    totalPages: number;
  }) => {
    updateBookDetails(bookId, values);
  };

  return (
    <AddAndEditBookDialog
      title="Edit book"
      submitLabel="Save"
      ariaLabelClose="Close edit book dialog"
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={{
        name: initialName,
        author: initialAuthor,
        totalPages: initialTotalPages,
      }}
    />
  );
};

export default EditBookDetailsDialog;
