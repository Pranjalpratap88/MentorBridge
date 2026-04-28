import api from './api';

const queryService = {
  // Get all queries (public feed)
  getAllQueries: () => api.get('/queries'),

  // Get popular/community queries (asked 10+ times)
  getPopularQueries: () => api.get('/queries/popular'),

  // Get queries by tag
  getQueriesByTag: (tag) => api.get(`/queries/tag/${encodeURIComponent(tag)}`),

  // Get a single query with responses
  getQueryById: (id) => api.get(`/queries/${id}`),

  // Get current user's queries
  getMyQueries: () => api.get('/queries/my'),

  // Get queries assigned to current user (for seniors/alumni/mentors)
  getAssignedQueries: () => api.get('/queries/assigned'),

  // Get queries targeted at a specific role
  getQueriesForRole: (role) => api.get(`/queries/role/${role}`),

  // Get unresolved queries (status = OPEN)
  getUnresolvedQueries: () => api.get('/queries/unresolved'),

  // Create a new query
  // queryData: { title, content, tags, targetRole?, assignedToId? }
  createQuery: (queryData) => api.post('/queries', queryData),

  // Submit a response to a query
  submitResponse: (queryId, responseData) =>
    api.post(`/queries/${queryId}/responses`, responseData),

  // Mark a response as best answer
  markBestAnswer: (responseId) =>
    api.put(`/queries/responses/${responseId}/best`),

  // Rate a response (1-5)
  rateResponse: (responseId, rating) =>
    api.put(`/queries/responses/${responseId}/rate?rating=${rating}`),

  // Mark satisfied with community answer (no need to send to expert)
  markSatisfied: (queryId) => api.put(`/queries/${queryId}/satisfied`),

  // Resend query to a specific expert after not being satisfied
  resendToExpert: (queryId, expertId) =>
    api.put(`/queries/${queryId}/resend/${expertId}`),
};

export default queryService;
