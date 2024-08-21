import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.yourswiftcardapp.com';

export const sendOrderEmail = async (formData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/orders`, formData);
    if (response.status !== 200) {
      throw new Error('Failed to send order');
    }
    return response.data;
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};

export const sendSMS = async (phoneNumber: string, message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/notifications/sms`, { phoneNumber, message });
    if (response.status !== 200) {
      throw new Error('Failed to send SMS');
    }
    return response.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};