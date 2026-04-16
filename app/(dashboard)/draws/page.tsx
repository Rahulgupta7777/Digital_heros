export default function DrawsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-display font-bold text-warm-deep">Monthly draws</h1>
      <div className="rounded-3xl bg-white p-12 text-center shadow-soft">
        <p className="text-warm-deep/60 mb-4">No draws yet</p>
        <p className="text-sm text-warm-deep/50">Draws are published monthly. Add 5 scores to enter when the next draw is published.</p>
      </div>
    </div>
  );
}
