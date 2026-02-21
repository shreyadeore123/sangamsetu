import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { statsAPI } from '../../services/api';

const Dashboard = () => {
  const { user, hasAnyRole } = useAuth();
  const [stats, setStats] = useState({ missing_count: 0, found_count: 0, match_count: 0, total_cases: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await statsAPI.getDashboardStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats({ missing_count: 0, found_count: 0, match_count: 0, total_cases: 0 });
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome, {user?.first_name || user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">
            Logged in as <span className="font-semibold text-blue-600">{user?.role}</span>
          </p>
        </div>

        {!statsLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide">Missing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.missing_count ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide">Found</p>
              <p className="text-2xl font-bold text-gray-900">{stats.found_count ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide">Match Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.match_count ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-indigo-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide">Confirmed Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_cases ?? 0}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
            <Link
              to="/missing-person/register"
              className="group bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Register Missing Person</h3>
              <p className="text-gray-600 text-sm">Report a new missing person case</p>
            </Link>
          )}

          {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
            <Link
              to="/found-person/register"
              className="group bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Register Found Person</h3>
              <p className="text-gray-600 text-sm">Report a found person</p>
            </Link>
          )}

          {hasAnyRole(['POLICE', 'ADMIN']) && (
            <Link
              to="/matches"
              className="group bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">🔗</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Match Suggestions</h3>
              <p className="text-gray-600 text-sm">Review and confirm matches</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
