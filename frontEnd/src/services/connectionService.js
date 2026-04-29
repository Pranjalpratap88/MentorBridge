import api from './api';

const connectionService = {
  // Send a connection request
  sendRequest: (receiverId) => api.post(`/connections/request/${receiverId}`),

  // Accept / reject a request
  accept: (id) => api.put(`/connections/${id}/accept`),
  reject: (id) => api.put(`/connections/${id}/reject`),

  // Withdraw a sent request
  withdraw: (id) => api.put(`/connections/${id}/withdraw`),

  // Remove an accepted connection
  remove: (id) => api.delete(`/connections/${id}`),

  // Get all accepted connections
  getMyConnections: () => api.get('/connections'),

  // Get pending requests received
  getPendingReceived: () => api.get('/connections/pending/received'),

  // Get pending requests sent
  getPendingSent: () => api.get('/connections/pending/sent'),

  // Get connection status with a specific user
  getStatus: (userId) => api.get(`/connections/status/${userId}`),

  // Send a message (must be connected)
  sendMessage: (receiverId, content) =>
    api.post(`/connections/messages/${receiverId}`, { content }),

  // Get conversation with a user
  getConversation: (partnerId) => api.get(`/connections/messages/${partnerId}`),

  // Get inbox (latest message per conversation)
  getInbox: () => api.get('/connections/inbox'),

  // Get unread message count
  getUnreadCount: () => api.get('/connections/messages/unread-count'),
};

export default connectionService;
