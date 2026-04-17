import { createFileRoute } from "@tanstack/react-router"

import PlaceholderPage from "@/components/pages/PlaceholderPage"

const ProfileRoute = () => (
  <PlaceholderPage
    title="Profile"
    description="Your reading stats will live here."
  />
)

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
})
