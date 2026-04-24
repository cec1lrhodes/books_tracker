import SectionHeading from "@/components/layout/SectionHeading";
import type { ReadingSession } from "@/data/books";

type ReadingSessionsSectionProps = {
  sessions: ReadingSession[];
};

const renderSessionMetric = (session: ReadingSession) => {
  if (session.minutes) {
    return (
      <span className="text-sm text-muted-foreground">
        {session.minutes} min
      </span>
    );
  }
  return (
    <span className="text-sm font-medium text-foreground">
      +{session.toPage - session.fromPage} pp
    </span>
  );
};

const renderSessionItem = (session: ReadingSession) => (
  <li
    key={session.id}
    className="flex items-center justify-between rounded-xl bg-card px-4 py-3"
  >
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">
        {session.label}
      </span>
      <span className="text-xs text-muted-foreground">
        pp. {session.fromPage} – {session.toPage}
      </span>
    </div>
    {renderSessionMetric(session)}
  </li>
);

const ReadingSessionsSection = ({ sessions }: ReadingSessionsSectionProps) => (
  <section aria-labelledby="sessions-heading" className="mt-8">
    <SectionHeading id="sessions-heading" className="mb-2">
      Reading sessions
    </SectionHeading>
    {sessions.length === 0 ? (
      <p className="text-sm text-muted-foreground">No sessions yet.</p>
    ) : (
      <ul className="flex flex-col gap-3">{sessions.map(renderSessionItem)}</ul>
    )}
  </section>
);

export default ReadingSessionsSection;
