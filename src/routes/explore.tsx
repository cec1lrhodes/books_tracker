import { createFileRoute } from "@tanstack/react-router"

import ExplorePage from "@/components/pages/ExplorePage"

const ExploreRoute = () => <ExplorePage />

export const Route = createFileRoute("/explore")({
  component: ExploreRoute,
})
