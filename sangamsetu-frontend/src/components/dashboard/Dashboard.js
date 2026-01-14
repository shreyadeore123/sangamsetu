import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, hasAnyRole, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user?.first_name || user?.username}!
          </h2>
          <p className="text-gray-600">
            You are logged in as <strong>{user?.role}</strong>
          </p>
        </div>

     {/* Action Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

  {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
    <Link
      to="/missing-person/register"
      className="group bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition">🔍</div>
      <h3 className="text-lg font-semibold mb-1">Register Missing Person</h3>
      <p className="text-gray-600 text-sm">
        Report a new missing person case
      </p>
    </Link>
  )}

  {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
    <Link
      to="/found-person/register"
      className="group bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition">✅</div>
      <h3 className="text-lg font-semibold mb-1">Register Found Person</h3>
      <p className="text-gray-600 text-sm">
        Report a found person
      </p>
    </Link>
  )}

  {hasAnyRole(['POLICE', 'ADMIN']) && (
    <Link
      to="/matches"
      className="group bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition">🔗</div>
      <h3 className="text-lg font-semibold mb-1">Match Suggestions</h3>
      <p className="text-gray-600 text-sm">
        Review AI-generated matches
      </p>
    </Link>
  )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
