'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EMPLOYEES } from '../../lib/users';
import { getReviews } from '../../lib/sheets';
import ReviewForm from '../../components/ReviewForm';

export default function ManagerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(EMPLOYEES[0]?.id || '');

  useEffect(() => {
    const raw = sessionStorage.getItem('cp_user');

    if (!raw) {
      router.push('/');
      return;
    }

    const u = JSON.parse(raw);

    if (u.role !== 'manager') {
      router.push('/employee');
      return;
    }

    setUser(u);
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      setLoadError('');

      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadError(e?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  const reviewedThisMonthNames = useMemo(() => {
    const now = new Date();
    const names = new Set();

    reviews.forEach((r) => {
      const d = new Date(r.timestamp);

      if (
        !isNaN(d.getTime()) &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      ) {
        names.add(r.employeeName);
      }
    });

    return names;
  }, [reviews]);

  function logout() {
    sessionStorage.removeItem('cp_user');
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">

      {/* HEADER */}
      <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-[#111827]">
        <div className="font-bold text-lg">Crystal People</div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {user.name} · Manager
          </span>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* ERROR */}
      {loadError && (
        <p className="text-red-400 text-sm text-center mt-3">
          {loadError}
        </p>
      )}

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

        {/* SIDEBAR */}
        <aside className="bg-[#111827] border border-gray-800 rounded-2xl p-3">

          <p className="text-xs mb-3 text-gray-400">
            Team ({EMPLOYEES.length}) {loading && 'loading...'}
          </p>

          <div className="space-y-1 max-h-[70vh] overflow-y-auto">

            {EMPLOYEES.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                  ${
                    selectedId === e.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#0B1220] text-gray-200 hover:bg-gray-800'
                  }
                `}
              >
                {e.name}
              </button>
            ))}

          </div>
        </aside>

        {/* MAIN */}
        <main>
          <ReviewForm
            employees={EMPLOYEES}
            selectedId={selectedId}
            onSelectEmployee={setSelectedId}
            reviewedThisMonthNames={reviewedThisMonthNames}
            managerName={user.name}
            onSubmitted={loadReviews}
          />
        </main>

      </div>
    </div>
  );
}