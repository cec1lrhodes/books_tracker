import { createFileRoute } from "@tanstack/react-router"

import MainPage from "@/components/pages/MainPage"

export const Route = createFileRoute("/")({
  component: MainPage,
})
