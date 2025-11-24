import api from "../utils/api";

// Get user profile
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.post(
    `/users/${userId}/upload-profile-picture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
