import api from '../../../lib/axios';

const profileService = {

  // GET /Users/{id} 
  async getProfile(id) {
    try {
      const response = await api.get(`/Users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /Users/{id}
  async updateProfile(id, data) {
    try {
      const response = await api.put(`/Users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /Authentication/change-password
  async changePassword(userName, currentPassword, newPassword, confirmPassword) {
    try {
      const response = await api.post(`/Authentication/change-password?userName=${userName}`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default profileService;