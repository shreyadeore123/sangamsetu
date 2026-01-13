import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, hasAnyRole, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            SangamSetu Dashboard
          </h1>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.first_name || user?.username} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
            <Link
              to="/missing-person/register"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">
                Register Missing Person
              </h3>
              <p className="text-gray-600 text-sm">
                Report a new missing person case
              </p>
            </Link>
          )}

          {hasAnyRole(['VOLUNTEER', 'POLICE', 'ADMIN']) && (
            <Link
              to="/found-person/register"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">
                Register Found Person
              </h3>
              <p className="text-gray-600 text-sm">
                Report a found person
              </p>
            </Link>
          )}

          {hasAnyRole(['POLICE', 'ADMIN']) && (
            <Link
              to="/matches"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold mb-2">
                View Match Suggestions
              </h3>
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
