import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseUrl = "http://localhost:8000";

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      return error.response.data.errorMessage;
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  } else {
    console.error('Non-Axios error:', error);
  }
  return 'An unexpected error occurred';
};

// Function to send a message
export const sendMessage = async (userdata: FormData): Promise<string> => {
  // Prepare the data with type annotation
  const data: string = JSON.stringify(userdata);

  // Define the Axios request configuration with type safety
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/send-message/messages',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data,
  };

  try {
    // Make the request and handle the response with type safety
    const response: AxiosResponse = await axios.request(config);
    console.log('Response data:', JSON.stringify(response.data));
    return "successfully Sent Message";
  } catch (error: any) {
    // Handle any errors that occur during the request
    console.error('Error occurred:', error.message || error);
    return handleAxiosError(error);
  }
};

export const getAllClientDetails = async (): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/client`,
    headers: {}
  };

  try {
    const response: AxiosResponse = await axios.request(config);
    console.log('Response data:', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error('Error occurred:', error.message || error);
    let errorMessage: string = handleAxiosError(error);
    throw Error(errorMessage);
  }
};


