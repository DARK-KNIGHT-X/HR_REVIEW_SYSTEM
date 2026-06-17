'use client';

import { useState } from 'react';

function monthLabel(timestamp) {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
}

export default function ReviewTimeline({ reviews, employeeName }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sorted = [...reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews, employeeName }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate summary.');
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <section className="bg-panel border border-line rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm uppercase tracking-wider text-inkmuted">Trend summary</h2>
          <button
            onClick={generateSummary}
            disabled={loading || reviews.length === 0}
            className="text-sm font-medium border border-facet text-facet hover:bg-facet hover:text-white transition-colors rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Thinking…' : '✦ Generate AI Summary'}
          </button>
        </div>
        {error && <p className="text-coral text-sm">{error}</p>}
        {summary && <p className="text-ink leading-relaxed mt-2">{summary}</p>}
        {!summary && !error && !loading && (
          <p className="text-inkmuted text-sm">Tap &ldquo;Generate AI Summary&rdquo; for a plain-English read on your last few months.</p>
        )}
      </section>

      <section>
        {sorted.length === 0 && (
          <div className="bg-panel border border-line rounded-2xl shadow-soft p-8 text-center">
            <p className="text-inkmuted">No reviews yet. Check back after your first monthly check-in.</p>
          </div>
        )}

        {sorted.length > 0 && (
          <ol className="relative pl-8">
            <span className="timeline-line absolute left-[11px] top-2 bottom-2 w-px" />
            {sorted.map((r, idx) => (
              <li key={idx} className="relative mb-6">
                <span className="absolute -left-8 top-1 w-[22px] h-[22px] rounded-full bg-facet border-4 border-paper" />
                <div className="bg-panel border border-line rounded-2xl shadow-soft p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg">{monthLabel(r.timestamp)}</h3>
                  </div>
                  <div className="flex gap-6 mb-3">
                    <div className="text-center">
                      <span className={`gem gem-${r.outputQuality || 0}`}>{r.outputQuality || '–'}</span>
                      <p className="text-xs text-inkmuted mt-1">Output</p>
                    </div>
                    <div className="text-center">
                      <span className={`gem gem-${r.attendance || 0}`}>{r.attendance || '–'}</span>
                      <p className="text-xs text-inkmuted mt-1">Attendance</p>
                    </div>
                    <div className="text-center">
                      <span className={`gem gem-${r.teamwork || 0}`}>{r.teamwork || '–'}</span>
                      <p className="text-xs text-inkmuted mt-1">Teamwork</p>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-ink leading-relaxed">{r.comment}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}