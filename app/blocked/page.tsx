export default function BlockedPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-xl rounded-xl border bg-card text-card-foreground p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access blocked</h1>
        <p className="text-muted-foreground">
          Please reach out to your TL. Your account is not yet authorized.
        </p>
      </div>
    </main>
  );
}
