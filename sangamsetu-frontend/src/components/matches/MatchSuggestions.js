import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MatchSuggestions = () => {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [confirmingMatch, setConfirmingMatch] = useState(null);

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'ALL') params.status = filter;
      const data = await matchAPI.getSuggestions(params);
      setMatches(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load match suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMatch = async (id) => {
    if (!window.confirm('Confirm this match?')) return;
    try {
      setConfirmingMatch(id);
      await matchAPI.confirmMatch(id);
      await loadMatches();
      alert('Match confirmed');
    } catch {
      alert('Failed to confirm match');
    } finally {
      setConfirmingMatch(null);
    }
  };

  const handleRejectMatch = async (id) => {
    if (!window.confirm('Reject this match?')) return;
    try {
      setConfirmingMatch(id);
      await matchAPI.rejectMatch(id);
      await loadMatches();
      alert('Match rejected');
    } catch {
      alert('Failed to reject match');
    } finally {
      setConfirmingMatch(null);
    }
  };

  const confidencePercent = (c) => Math.round(c * 100);

  const confidenceColor = (c) =>
    c >= 80
      ? 'bg-green-50 text-green-700'
      : c >= 60
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-orange-50 text-orange-700';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline mb-3"
          >
            ← Back to Dashboard
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Match Suggestions</h1>
              <p className="text-gray-600">
                AI-generated matches between missing and found persons
              </p>
            </div>

            <button
              onClick={loadMatches}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && <p className="text-center">Loading matches...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && matches.length === 0 && (
          <div className="bg-white p-10 rounded-lg text-center shadow">
            No matches found
          </div>
        )}

        {/* Matches */}
        <div className="space-y-6">
          {matches.map((match) => {
            const confidence = confidencePercent(match.confidence);

            return (
              <div key={match.id} className="bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      match.is_confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {match.is_confirmed ? 'CONFIRMED' : 'PENDING'}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${confidenceColor(confidence)}`}>
                      {confidence}% Match
                    </span>
                  </div>

                  <span className="text-xs text-gray-500">
                    ID {match.id} • {new Date(match.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Missing */}
                  <div className="border-l-4 border-red-400 pl-4">
                    <h3 className="font-semibold mb-2">🔍 Missing Person</h3>
                    <p>Name: {match.missing_person?.name ?? 'N/A'}</p>
                    <p>Age: {match.missing_person?.approx_age ?? 'N/A'}</p>
                    <p>Gender: {match.missing_person?.gender ?? 'N/A'}</p>
                    <p>Last Seen: {match.missing_person?.last_seen_location ?? 'N/A'}</p>
                  </div>

                  {/* Found */}
                  <div className="border-l-4 border-green-400 pl-4">
                    <h3 className="font-semibold mb-2">✅ Found Person</h3>
                    <p>Age: {match.found_person?.approx_age ?? 'N/A'}</p>
                    <p>Gender: {match.found_person?.gender ?? 'N/A'}</p>
                    <p>Found At: {match.found_person?.found_location ?? 'N/A'}</p>
                    <p>Current Location: {match.found_person?.current_location ?? 'N/A'}</p>
                    <p>Finder Contact: {match.found_person?.finder_contact ?? 'N/A'}</p>
                  </div>
                </div>

                {/* Actions */}
                {hasAnyRole(['POLICE', 'ADMIN']) && !match.is_confirmed && (
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => handleRejectMatch(match.id)}
                      disabled={confirmingMatch === match.id}
                      className="border border-red-300 text-red-700 px-5 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleConfirmMatch(match.id)}
                      disabled={confirmingMatch === match.id}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchSuggestions;
