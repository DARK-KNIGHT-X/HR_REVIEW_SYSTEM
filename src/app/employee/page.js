'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewTimeline from '../../components/ReviewTimeline';

const SHEETS_API_URL = process.env.NEXT_PUBLIC_SHEETS_URL;

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('cp_user');

    if (!raw) {
      router.push('/');
      return;
    }

    const u = JSON.parse(raw);

    if (u.role !== 'employee') {
      router.push('/manager');
      return;
    }

    setUser(u);
    loadReviews(u.id);
  }, []);

  async function loadReviews(employeeId) {
    setLoading(true);
    setLoadError('');

    try {
      const res = await fetch(SHEETS_API_URL);
      if (!res.ok) throw new Error('Failed to fetch reviews');

      const data = await res.json();

      // Convert 2D array → objects
      const formatted = data
        .filter((row) => row[0] === employeeId) // employee match
        .map((row) => ({
          employee: row[0],
          quality: row[1],
          attendance: row[2],
          teamwork: row[3],
          comment: row[4],
          date: row[5],
        }));

      setReviews(formatted);
    } catch (e) {
      setLoadError(e.message);
    }

    setLoading(false);
  }

  function logout() {
    sessionStorage.removeItem('cp_user');
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="facet-rule" />
          <span className="font-display text-xl">Crystal People</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-inkmuted">
            {user.name} · {user.id}
          </span>
          <button
            onClick={logout}
            className="text-facet hover:text-facetdeep font-medium"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl mb-1">
            Your performance history
          </h1>
          <p className="text-inkmuted text-sm">
            Monthly scores and feedback from your manager.
          </p>
        </div>

        {loadError && (
          <p className="text-coral text-sm">{loadError}</p>
        )}

        {loading && (
          <p className="text-inkmuted text-sm">
            Loading your reviews…
          </p>
        )}

        {!loading && (
          <ReviewTimeline
            reviews={reviews}
            employeeName={user.name}
          />
        )}
      </div>
    </div>
  );
}