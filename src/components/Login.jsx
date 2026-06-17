'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { findUser } from '../lib/users';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const user = findUser(username, password);

    if (!user) {
      setError('Incorrect username or password.');
      return;
    }

    const { password: _omit, ...safeUser } = user;
    sessionStorage.setItem('cp_user', JSON.stringify(safeUser));

    router.push(safeUser.role === 'manager' ? '/manager' : '/employee');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">

      <div className="w-full max-w-sm">

        {/* BRAND */}
        <div className="mb-2">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Crystal Group
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white">
          Crystal People
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Monthly check-ins for the team.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4"
        >

          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B1220] border border-gray-700 text-white outline-none focus:border-indigo-500"
              placeholder="manager or emp01"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B1220] border border-gray-700 text-white outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            Sign in
          </button>
        </form>

        {/* DEMO CREDENTIALS (FIXED SECTION) */}
        <div className="mt-5 text-xs text-gray-400 bg-[#111827] border border-gray-800 rounded-xl p-4 space-y-2">

          <p className="text-gray-200 font-medium">
            Demo credentials
          </p>

          <p>
            Manager: <span className="text-white font-mono">manager</span> /{" "}
            <span className="text-white font-mono">crystal123</span>
          </p>

          <p>
            Employees:{" "}
            <span className="text-white font-mono">
              emp01 - emp20
            </span>{" "}
            /{" "}
            <span className="text-white font-mono">
              crystal123
            </span>
          </p>

        </div>
      </div>
    </main>
  );
}