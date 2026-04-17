import { createFileRoute } from "@tanstack/react-router"

import PlaceholderPage from "@/components/pages/PlaceholderPage"

const ExploreRoute = () => (
  <PlaceholderPage title="Explore" description="Discover new books soon." />
)

export const Route = createFileRoute("/explore")({
  component: ExploreRoute,
})
