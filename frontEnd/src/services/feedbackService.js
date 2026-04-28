import api from './api';

const feedbackService = {
  // Submit feedback
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),

  // Get my feedback (current user's feedback)
  getMyFeedback: () => api.get('/feedback/my'),

  // Admin-only: Get all feedback
  getAllFeedback: () => api.get('/feedback'),

  // Admin-only: Get unreviewed feedback
  getUnreviewedFeedback: () => api.get('/feedback/unreviewed'),

  // Admin-only: Get reviewed feedback
  getReviewedFeedback: () => api.get('/feedback/reviewed'),

  // Admin-only: Get feedback by category
  getFeedbackByCategory: (category) => api.get(`/feedback/category/${category}`),

  // Admin-only: Get feedback by ID
  getFeedbackById: (id) => api.get(`/feedback/${id}`),

  // Admin-only: Mark feedback as reviewed
  markAsReviewed: (id, adminNotes) => 
    api.put(`/feedback/${id}/review?adminNotes=${encodeURIComponent(adminNotes || '')}`),

  // Admin-only: Respond to feedback
  respondToFeedback: (id, response) =>
    api.post(`/feedback/${id}/respond`, { response }),

  // Admin-only: Get unreviewed count
  getUnreviewedCount: () => api.get('/feedback/stats/unreviewed-count'),

  // Admin-only: Get average rating
  getAverageRating: () => api.get('/feedback/stats/average-rating'),
};

export default feedbackService;
