import axios from 'axios';

const API_BASE_URL = '/.netlify/functions';

export const sendOrderEmail = async (formData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/handleOrder`, formData);
    if (response.status !== 200) {
      throw new Error('Failed to send order');
    }
    return response.data;
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};