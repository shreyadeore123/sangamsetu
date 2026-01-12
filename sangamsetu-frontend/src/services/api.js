import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access denied');
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication APIs ====================
export const authAPI = {
  // Login → SimpleJWT
  login: async (username, password) => {
    const response = await apiClient.post('/token/', {
      username,
      password,
    });
    return response.data; // { access, refresh }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/accounts/profile/');
    return response.data;
  },

  // Logout (frontend-only for JWT)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};



// ==================== Missing Person APIs ====================

export const missingPersonAPI = {
  create: async (data) => {
    const response = await apiClient.post('/cases/missing/', data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/cases/missing/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/cases/missing/${id}/`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/cases/missing/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/cases/missing/${id}/`);
    return response.data;
  },
};

// ==================== Found Person APIs ====================

export const foundPersonAPI = {
  // Create found person report
  create: async (data) => {
    const response = await apiClient.post('/cases/found/', data);
    return response.data;
  },

  // Get all found persons
  getAll: async (params = {}) => {
    const response = await apiClient.get('/cases/found/', { params });
    return response.data;
  },

  // Get single found person by ID
  getById: async (id) => {
    const response = await apiClient.get(`/cases/found/${id}/`);
    return response.data;
  },

  // Update found person
  update: async (id, data) => {
    const response = await apiClient.put(`/cases/found/${id}/`, data);
    return response.data;
  },

  // Delete found person
  delete: async (id) => {
    const response = await apiClient.delete(`/cases/found/${id}/`);
    return response.data;
  },
};


// ==================== Match APIs ====================

export const matchAPI = {
  // Get all match suggestions
  getSuggestions: async (params = {}) => {
    const response = await apiClient.get('/cases/matches/', { params });
    return response.data;
  },

  // Get single match by ID
  getById: async (id) => {
    const response = await apiClient.get(`/cases/matches/${id}/`);
    return response.data;
  },

  // Confirm a match
  confirmMatch: async (id) => {
    const response = await apiClient.post(`/cases/matches/${id}/confirm/`);
    return response.data;
  },

  // Reject a match
  rejectMatch: async (id) => {
    const response = await apiClient.post(`/cases/matches/${id}/reject/`);
    return response.data;
  },
};

// ==================== Statistics APIs (Admin only) ====================

export const statsAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await apiClient.get('/stats/dashboard/');
    return response.data;
  },

  // Get reports
  getReports: async (params = {}) => {
    const response = await apiClient.get('/stats/reports/', { params });
    return response.data;
  },
};

export default apiClient;
