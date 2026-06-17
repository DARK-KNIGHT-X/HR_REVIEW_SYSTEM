'use client';

import { useState } from 'react';
import { saveReview } from '../lib/sheets';

const DIMENSIONS = [
  { key: 'outputQuality', label: 'Output Quality' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'teamwork', label: 'Teamwork' },
];

export default function ReviewForm({
  employees,
  selectedId,
  onSelectEmployee,
  reviewedThisMonthNames,
  managerName,
  onSubmitted,
}) {
  const [scores, setScores] = useState({
    outputQuality: 0,
    attendance: 0,
    teamwork: 0,
  });

  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const employee =
    employees.find((e) => e.id === selectedId) || employees[0];

  const alreadyReviewed = reviewedThisMonthNames?.has(employee.name);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !scores.outputQuality ||
      !scores.attendance ||
      !scores.teamwork
    ) {
      setMessage('Set all three scores before submitting.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await saveReview({
        employeeName: employee.name,
        ...scores,
        comment,
      });

      setMessage('Saved successfully to Google Sheets.');

      setScores({
        outputQuality: 0,
        attendance: 0,
        teamwork: 0,
      });

      setComment('');

      if (onSubmitted) onSubmitted();
    } catch (err) {
      setMessage(err.message || 'Could not save review.');
    }

    setSaving(false);
  }

  return (
    <section className="card">

      {/* Employee Select */}
      <div className="mb-5">
        <label className="block text-xs text-gray-400 mb-1">
          Employee
        </label>

        <select
          value={employee.id}
          onChange={(e) => onSelectEmployee(e.target.value)}
          className="input"
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {/* Warning */}
      {alreadyReviewed && (
        <p className="text-yellow-400 text-sm mb-4 bg-yellow-900/20 border border-yellow-700 rounded-lg px-3 py-2">
          {employee.name} already has a review this month.
          Submitting again will add a new entry.
        </p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* RATINGS */}
        {DIMENSIONS.map((d) => (
          <div key={d.key}>
            <label className="block text-sm font-medium mb-2">
              {d.label}
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    setScores((s) => ({ ...s, [d.key]: n }))
                  }
                  className={`gem ${
                    scores[d.key] === n
                      ? 'gem-' + n
                      : 'gem-0'
                  } hover:scale-110 transition`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* COMMENT */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Comment
          </label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input"
            placeholder="What stood out this month?"
          />
        </div>

        {/* BUTTON + MESSAGE */}
        <div className="space-y-2">

          <button
            type="submit"
            disabled={saving}
            className="btn-submit"
          >
            {saving ? 'Saving…' : 'Submit Review'}
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.includes('Saved')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </div>

      </form>
    </section>
  );
}