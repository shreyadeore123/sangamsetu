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
      if (filter !== 'ALL') {
        params.status = filter;
      }
      const data = await matchAPI.getSuggestions(params);
      setMatches(data.results || data);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load match suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to confirm this match?')) {
      return;
    }

    try {
      setConfirmingMatch(matchId);
      await matchAPI.confirmMatch(matchId);
      
      // Reload matches
      await loadMatches();
      alert('Match confirmed successfully!');
    } catch (err) {
      console.error('Error confirming match:', err);
      alert(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to confirm match'
      );
    } finally {
      setConfirmingMatch(null);
    }
  };

  const handleRejectMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to reject this match?')) {
      return;
    }

    try {
      setConfirmingMatch(matchId);
      await matchAPI.rejectMatch(matchId);
      
      // Reload matches
      await loadMatches();
      alert('Match rejected successfully!');
    } catch (err) {
      console.error('Error rejecting match:', err);
      alert(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to reject match'
      );
    } finally {
      setConfirmingMatch(null);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.PENDING;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Match Suggestions</h1>
              <p className="text-gray-600 mt-2">AI-generated matches between missing and found persons</p>
            </div>
            <button
              onClick={loadMatches}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'PENDING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'CONFIRMED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'REJECTED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Loading matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Matches List */}
        {!loading && !error && (
          <div className="space-y-6">
            {matches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No matches found</p>
              </div>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
                  {/* Match Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(match.status)}`}>
                          {match.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(match.confidence_score)}`}>
                          {match.confidence_score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Match ID: {match.id} | Created: {new Date(match.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Missing Person */}
                    <div className="border-l-4 border-red-400 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        🔍 Missing Person
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Name:</dt>
                          <dd className="text-gray-900">{match.missing_person?.name || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Age:</dt>
                          <dd className="text-gray-900">{match.missing_person?.age || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Gender:</dt>
                          <dd className="text-gray-900">{match.missing_person?.gender || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Last Seen:</dt>
                          <dd className="text-gray-900">{match.missing_person?.last_seen_location || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Contact:</dt>
                          <dd className="text-gray-900">{match.missing_person?.contact_phone || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Found Person */}
                    <div className="border-l-4 border-green-400 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        ✅ Found Person
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Approximate Age:</dt>
                          <dd className="text-gray-900">{match.found_person?.approximate_age || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Gender:</dt>
                          <dd className="text-gray-900">{match.found_person?.gender || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Found At:</dt>
                          <dd className="text-gray-900">{match.found_person?.found_location || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Current Location:</dt>
                          <dd className="text-gray-900">{match.found_person?.current_location || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Finder Contact:</dt>
                          <dd className="text-gray-900">{match.found_person?.finder_phone || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Match Reason */}
                  {match.match_reason && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Match Reason:</h4>
                      <p className="text-sm text-gray-600">{match.match_reason}</p>
                    </div>
                  )}

                  {/* Actions - Only for Police and Admin, and only for PENDING matches */}
                  {hasAnyRole(['POLICE', 'ADMIN']) && match.status === 'PENDING' && (
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        onClick={() => handleRejectMatch(match.id)}
                        disabled={confirmingMatch === match.id}
                        className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {confirmingMatch === match.id ? 'Processing...' : 'Reject Match'}
                      </button>
                      <button
                        onClick={() => handleConfirmMatch(match.id)}
                        disabled={confirmingMatch === match.id}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {confirmingMatch === match.id ? 'Processing...' : 'Confirm Match'}
                      </button>
                    </div>
                  )}

                  {/* Confirmed/Rejected Message */}
                  {match.status === 'CONFIRMED' && match.confirmed_by && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✓ Confirmed by {match.confirmed_by.username} on {new Date(match.confirmed_at).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {match.status === 'REJECTED' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        ✗ This match has been rejected
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSuggestions;
