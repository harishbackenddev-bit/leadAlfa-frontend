import axiosInstance from "./axiosInstance";

/**
 * Fetch all chat rooms for current user (brand or creator)
 * @returns {Promise} Array of chat rooms with last message
 */
export const getChatRooms = async () => {
  try {
    const response = await axiosInstance.get("/chat/rooms");
    // Normalize to return the rooms array directly
    return response.data?.rooms ?? [];
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Fetch messages for a specific chat room
 * @param {string} chatRoomId
 * @returns {Promise} Array of messages
 */
export const getChatMessages = async (chatRoomId) => {
  try {
    // Primary endpoint (existing)
    try {
      const response = await axiosInstance.get(
        `/chat/room/${chatRoomId}/messages`,
      );
      return response.data?.messages ?? response.data;
    } catch (err) {
      // If 404, try alternate endpoint
      if (err?.response?.status === 404) {
        const altResp = await axiosInstance.get(`/chat/messages/${chatRoomId}`);
        return altResp.data?.messages ?? altResp.data;
      }
      throw err;
    }
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Upload media files for chat
 * @param {FormData} formData - Contains files[]
 * @returns {Promise} Array of uploaded media with IDs and URLs
 */
export const uploadChatMedia = async (formData) => {
  try {
    const response = await axiosInstance.post("/chat/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mark chat room as read
 * @param {string} chatRoomId
 * @returns {Promise}
 */
export const markChatAsRead = async (chatRoomId) => {
  try {
    const response = await axiosInstance.patch(
      `/chat/rooms/${chatRoomId}/read`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};
