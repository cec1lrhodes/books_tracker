import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Home, Library, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  matchPrefix?: string;
};

const navItems: NavItem[] = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/library", label: "Library", Icon: Library, matchPrefix: "/library" },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/profile", label: "Profile", Icon: User },
];

const isActivePath = (pathname: string, item: NavItem): boolean => {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
  return pathname === item.to;
};

const BottomNav = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-md items-stretch"
      >
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item);
          const { Icon, label, to } = item;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
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
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
