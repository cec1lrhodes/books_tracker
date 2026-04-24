import { Progress } from "@/components/ui/progress";
import { getProgressPercent } from "@/data/books";
import { cn } from "@/lib/utils";

type ReadingProgressProps = {
  currentPage: number;
  totalPages: number;
  className?: string;
  withPercent?: boolean;
};

const ReadingProgress = ({
  currentPage,
  totalPages,
  className,
  withPercent = true,
}: ReadingProgressProps) => {
  const percent = getProgressPercent(currentPage, totalPages);

  if (!withPercent) {
    return <Progress value={percent} className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress value={percent} className="flex-1" />
      <span className="text-xs font-medium text-foreground">{percent}%</span>
    </div>
  );
};

export default ReadingProgress;
