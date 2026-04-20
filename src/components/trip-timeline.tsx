import trips from "@/data/trips.json";

export function TripTimeline() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5">
      <h2 className="text-sm font-semibold text-white">Trip & phase timeline</h2>
      <ul className="mt-4 space-y-3">
        {(trips as { trip: string; timing: string; length: string; purpose: string }[]).map(
          (row) => (
            <li
              key={row.trip}
              className="border-l-2 border-accent pl-4 text-sm text-slate-300"
            >
              <span className="font-medium text-slate-100">{row.trip}</span>
              <span className="text-slate-500"> — {row.timing}</span>
              {row.length ? (
                <span className="text-slate-500"> ({row.length})</span>
              ) : null}
              <p className="mt-0.5 text-slate-400">{row.purpose}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
