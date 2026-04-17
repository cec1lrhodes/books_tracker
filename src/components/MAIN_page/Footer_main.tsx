import { Home, Library, Shuffle } from "lucide-react";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

type NavItemId = "random" | "home" | "library";

type NavItem = {
  id: NavItemId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { id: "random", label: "Random", Icon: Shuffle },
  { id: "home", label: "Home", Icon: Home },
  { id: "library", label: "Library", Icon: Library },
];

const Footer_main = () => {
  const [activeItem, setActiveItem] = useState<NavItemId>("home");

  const handleSelect = (id: NavItemId) => setActiveItem(id);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-md items-stretch"
      >
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeItem === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleSelect(id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActive && "stroke-[2.25]")}
                aria-hidden="true"
              />
              <span className="uppercase tracking-wide">{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer_main;
