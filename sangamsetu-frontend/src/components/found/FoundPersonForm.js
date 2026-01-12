import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundPersonAPI } from '../../services/api';

const FoundPersonForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    approximate_age: '',
    gender: '',
    found_location: '',
    found_date: '',
    physical_description: '',
    clothing_description: '',
    distinctive_features: '',
    mental_state: '',
    finder_name: '',
    finder_phone: '',
    finder_email: '',
    current_location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await foundPersonAPI.create(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        approximate_age: '',
        gender: '',
        found_location: '',
        found_date: '',
        physical_description: '',
        clothing_description: '',
        distinctive_features: '',
        mental_state: '',
        finder_name: '',
        finder_phone: '',
        finder_email: '',
        current_location: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to register found person. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Register Found Person</h1>
          <p className="text-gray-600 mt-2">Record details of a found person</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            Found person registered successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="approximate_age"
                  value={formData.approximate_age}
                  onChange={handleChange}
                  required
                  min="0"
                  max="150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Estimated age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Found Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="found_date"
                  value={formData.found_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mental State
                </label>
                <select
                  name="mental_state"
                  value={formData.mental_state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  <option value="ALERT">Alert/Normal</option>
                  <option value="CONFUSED">Confused</option>
                  <option value="DISTRESSED">Distressed</option>
                  <option value="UNCONSCIOUS">Unconscious</option>
                  <option value="INJURED">Injured</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Found Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="found_location"
                  value={formData.found_location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Near Railway Station, Gate 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where the person is being kept (e.g., Police Station, Medical Center)"
                />
              </div>
            </div>
          </div>

          {/* Physical Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Physical Description</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Description
                </label>
                <textarea
                  name="physical_description"
                  value={formData.physical_description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Height, build, hair color, complexion, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clothing Description
                </label>
                <input
                  type="text"
                  name="clothing_description"
                  value={formData.clothing_description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What the person is wearing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distinctive Features
                </label>
                <textarea
                  name="distinctive_features"
                  value={formData.distinctive_features}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Scars, tattoos, birthmarks, jewelry, etc."
                />
              </div>
            </div>
          </div>

          {/* Finder Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Finder Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="finder_name"
                  value={formData.finder_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finder Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="finder_phone"
                  value={formData.finder_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finder Email
                </label>
                <input
                  type="email"
                  name="finder_email"
                  value={formData.finder_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address (optional)"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Register Found Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoundPersonForm;
