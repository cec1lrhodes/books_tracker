import BottomNav from "@/components/layout/BottomNav"

type PlaceholderPageProps = {
  title: string
  description?: string
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col pb-24">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </main>
      <BottomNav />
    </div>
  )
}

export default PlaceholderPage
