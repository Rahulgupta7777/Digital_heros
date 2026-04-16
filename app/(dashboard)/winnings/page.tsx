export default function WinningsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-display font-bold text-warm-deep">Your winnings</h1>
      <div className="rounded-3xl bg-white p-12 text-center shadow-soft">
        <p className="text-warm-deep/60 mb-4">No winnings yet</p>
        <p className="text-sm text-warm-deep/50">When you match the draw numbers, you&apos;ll see your winnings here and can submit proof of your win.</p>
      </div>
    </div>
  );
}
