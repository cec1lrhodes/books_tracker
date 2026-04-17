import { createRootRoute, Outlet } from "@tanstack/react-router"

import PlaceholderPage from "@/components/pages/PlaceholderPage"

const RootLayout = () => (
  <div className="min-h-screen w-full bg-background text-foreground">
    <Outlet />
  </div>
)

const NotFound = () => (
  <PlaceholderPage
    title="Page not found"
    description="Check the URL and try again."
  />
)

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
