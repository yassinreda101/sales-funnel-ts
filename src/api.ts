import axios from 'axios';

const API_BASE_URL = '/.netlify/functions';

export const sendOrderEmail = async (formData: any) => {
  try {
    console.log('Sending order to API:', formData);
    const response = await axios.post(`${API_BASE_URL}/handleOrder`, formData);
    console.log('API response:', response);
    if (response.status !== 200) {
      throw new Error(`Failed to send order: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    } else {
      console.error("Unknown error:", error);
      throw new Error('An unknown error occurred');
    }
  }
};