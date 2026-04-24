import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

const SectionHeading = ({ id, children, className }: SectionHeadingProps) => (
  <h2
    id={id}
    className={cn(
      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className,
    )}
  >
    {children}
  </h2>
);

export default SectionHeading;
