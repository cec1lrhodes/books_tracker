import {
  ImageOff,
  ImagePlus,
  MoreHorizontal,
  Pencil,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BookActionsMenuProps = {
  hasCover: boolean;
  onEdit: () => void;
  onChangeCover: () => void;
  onRemoveCover: () => void;
  onRate: () => void;
  onChangeGenres: () => void;
  onDelete: () => void;
};

const BookActionsMenu = ({
  hasCover,
  onEdit,
  onChangeCover,
  onRemoveCover,
  onRate,
  onChangeGenres,
  onDelete,
}: BookActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Book actions"
        className="h-10 w-10 rounded-full"
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onSelect={onEdit}>
        <Pencil aria-hidden="true" />
        Changes
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onChangeCover}>
        <ImagePlus aria-hidden="true" />
        {hasCover ? "Change photo" : "Add photo"}
      </DropdownMenuItem>
      {hasCover && (
        <DropdownMenuItem onSelect={onRemoveCover}>
          <ImageOff aria-hidden="true" />
          Remove photo
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onSelect={onRate}>
        <Star aria-hidden="true" />
        Rate
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onChangeGenres}>
        <Tag aria-hidden="true" />
        Genre
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={onDelete}>
        <Trash2 aria-hidden="true" />
        Trash
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default BookActionsMenu;
