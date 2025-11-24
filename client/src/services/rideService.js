import api from "../utils/api";

// Get all rides
export const getRides = async () => {
  const response = await api.get("/rides");
  return response.data;
};

// Get single ride
export const getRide = async (id) => {
  const response = await api.get(`/rides/${id}`);
  return response.data;
};

// Create ride
export const createRide = async (rideData) => {
  const response = await api.post("/rides", rideData);
  return response.data;
};

// Update ride
export const updateRide = async (id, rideData) => {
  const response = await api.put(`/rides/${id}`, rideData);
  return response.data;
};

// Delete ride
export const deleteRide = async (id) => {
  const response = await api.delete(`/rides/${id}`);
  return response.data;
};

// Join ride
export const joinRide = async (id) => {
  const response = await api.post(`/rides/${id}/join`);
  return response.data;
};

// Unjoin ride
export const unjoinRide = async (id) => {
  const response = await api.post(`/rides/${id}/unjoin`);
  return response.data;
};
