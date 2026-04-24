import { useState } from "react";

import SectionHeading from "@/components/layout/SectionHeading";
import type { Thought } from "@/data/books";
import { cn } from "@/lib/utils";

type ThoughtsSectionProps = {
  thoughts: Thought[];
};

type ThoughtItemProps = {
  thought: Thought;
  isExpanded: boolean;
  onToggle: (id: string) => void;
};

const ThoughtItem = ({ thought, isExpanded, onToggle }: ThoughtItemProps) => {
  const handleClick = () => onToggle(thought.id);

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse thought" : "Expand thought"}
        className="flex w-full items-start gap-3 rounded-xl bg-card px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="shrink-0 text-sm font-medium text-foreground">
          {thought.label}
        </span>
        <div
          className={cn(
            "grid min-w-0 flex-1 transition-[grid-template-rows] duration-500 ease-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[1.25rem]",
          )}
        >
          <p
            className={cn(
              "overflow-hidden text-right text-sm text-muted-foreground",
              isExpanded ? "whitespace-normal" : "truncate",
            )}
          >
            {thought.text}
          </p>
        </div>
      </button>
    </li>
  );
};

const ThoughtsSection = ({ thoughts }: ThoughtsSectionProps) => {
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(
    null,
  );

  const handleToggle = (id: string) =>
    setExpandedThoughtId((current) => (current === id ? null : id));

  return (
    <section aria-labelledby="thoughts-heading" className="mt-8">
      <SectionHeading id="thoughts-heading" className="mb-2">
        Thoughts
      </SectionHeading>
      {thoughts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No thoughts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {thoughts.map((thought) => (
            <ThoughtItem
              key={thought.id}
              thought={thought}
              isExpanded={expandedThoughtId === thought.id}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ThoughtsSection;
