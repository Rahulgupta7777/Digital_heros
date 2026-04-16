export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-warm-gradient bg-grain p-12">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-warm-coral to-warm-sunrise">
            <span className="text-2xl font-bold text-white font-display">F</span>
          </div>
          <p className="mt-4 font-display text-2xl font-bold text-warm-deep">Fairway Giving</p>
        </div>

        <blockquote className="max-w-sm">
          <p className="mb-4 text-lg italic text-warm-deep">
            &ldquo;I joined for the draw. I stayed because every score I logged became something bigger.&rdquo;
          </p>
          <p className="text-sm font-medium text-warm-deep/70">Marcus T., Ocean Conservancy supporter</p>
        </blockquote>

        <div className="text-sm text-warm-deep/60">
          <p>Play the game.</p>
          <p>Change a life.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
