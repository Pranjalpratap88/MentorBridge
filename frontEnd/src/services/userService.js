import api from './api';

const userService = {
  // Get current user's profile
  getProfile: () => api.get('/users/profile'),

  // Update profile
  updateProfile: (data) => api.put('/users/profile', data),

  // Get leaderboard (all users sorted by reputation)
  getLeaderboard: () => api.get('/users/leaderboard'),

  // Get users by role (STUDENT, SENIOR_STUDENT, ALUMNI, MENTOR)
  getUsersByRole: (role) => api.get(`/users/role/${role}`),

  // Get network users (seniors, alumni, mentors) for the current user
  getNetworkUsers: () => api.get('/users/network'),

  // Search experts for private query targeting
  // params: { role?, industry?, college? }
  searchExperts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.role) query.append('role', params.role);
    if (params.industry) query.append('industry', params.industry);
    if (params.college) query.append('college', params.college);
    return api.get(`/users/experts?${query.toString()}`);
  },

  // Get dashboard stats for current user
  getDashboardStats: () => api.get('/users/dashboard-stats'),

  // Admin-only
  getAllUsers: () => api.get('/users/admin/all'),
  toggleUserLock: (id) => api.put(`/users/admin/${id}/toggle-lock`),
  toggleUserEnable: (id) => api.put(`/users/admin/${id}/toggle-enable`),
  getAdminStats: () => api.get('/users/admin/stats'),

  // Search users to send a query to (with rich filters)
  searchQueryTargets: (params = {}) => {
    const q = new URLSearchParams();
    if (params.roles?.length) q.append('roles', params.roles.join(','));
    if (params.college)       q.append('college', params.college);
    if (params.company)       q.append('company', params.company);
    if (params.industry)      q.append('industry', params.industry);
    if (params.minReputation) q.append('minReputation', params.minReputation);
    if (params.limit)         q.append('limit', params.limit);
    return api.get(`/users/query-targets?${q.toString()}`);
  },
};

export default userService;
