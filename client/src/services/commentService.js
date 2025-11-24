import api from "../utils/api";

// Get comments for a ride
export const getComments = async (rideId) => {
  const response = await api.get(`/rides/${rideId}/comments`);
  return response.data;
};

// Add comment to ride
export const addComment = async (rideId, text) => {
  const response = await api.post(`/rides/${rideId}/comments`, { text });
  return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
