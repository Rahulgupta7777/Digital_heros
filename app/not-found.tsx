import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-gradient px-6">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-6xl font-display font-bold text-warm-coral">404</h1>
        <h2 className="mb-4 text-2xl font-display font-bold text-warm-deep">Page not found</h2>
        <p className="mb-8 text-warm-deep/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-warm-coral px-8 py-3 font-medium text-white hover:bg-[#FF5555] transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
