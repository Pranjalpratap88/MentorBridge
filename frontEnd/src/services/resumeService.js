import api from './api';

const resumeService = {
  // Upload a resume PDF
  upload: (file, title) => {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    return api.post('/resumes', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // Get my resumes
  getMyResumes: () => api.get('/resumes/my'),

  // Get a single resume with reviews
  getById: (id) => api.get(`/resumes/${id}`),

  // Get PDF as blob URL (fetches with JWT, returns object URL for iframe/download)
  getPdfBlobUrl: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/resumes/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to load PDF');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  // Get PDF download URL (returns URL string for PDF download link)
  getDownloadUrl: (id) => `http://localhost:8080/api/resumes/${id}/download`,

  // Update resume settings (visibility, review request, etc.)
  updateSettings: (id, data) => api.put(`/resumes/${id}/settings`, data),

  // Archive / restore / delete
  archive: (id) => api.put(`/resumes/${id}/archive`),
  restore: (id) => api.put(`/resumes/${id}/restore`),
  delete: (id) => api.delete(`/resumes/${id}`),

  // Browse resumes open for review (for seniors/alumni/mentors)
  getOpenForReview: () => api.get('/resumes/open-for-review'),

  // Submit a review
  submitReview: (resumeId, reviewData) => api.post(`/resumes/${resumeId}/reviews`, reviewData),

  // Get reviews for a resume
  getReviews: (resumeId) => api.get(`/resumes/${resumeId}/reviews`),

  // Get reviews I've written
  getMyReviews: () => api.get('/resumes/my-reviews'),

  // Add a comment to a review
  addComment: (reviewId, content) => api.post(`/resumes/reviews/${reviewId}/comments`, { content }),
};

export default resumeService;
