import Link from "next/link";

export default function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-destructive">
          Authentication Error
        </h1>
        <p className="text-muted-foreground mb-6">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block w-full text-center bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
