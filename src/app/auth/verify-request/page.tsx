export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-muted-foreground mb-4">
          A sign in link has been sent to your email address.
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to sign in. You can close this window.
        </p>
      </div>
    </div>
  );
}
