import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import handleAxiosError from '../utils/AxiosErrorHandling';
import TripDetailRequest from '../models/TripDetailRequest';

const baseUrl = "http://localhost:8000";



// Function to send a message
export const saveTripDetails = async (requestData: TripDetailRequest): Promise<string> => {
  // Prepare the data with type annotation
  const data: string = JSON.stringify(requestData);

  // Define the Axios request configuration with type safety
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/trip`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data,
  };


  const response: AxiosResponse = await axios.request(config);
  console.log('Response data:', JSON.stringify(response.data));
  return "successfully Sent Message";

};


export const getTripDetails = async (pageNo: number, pageSize: number, order: string): Promise<string> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/trip?pageNo=${pageNo}&pageSize=${pageSize}&order=${order}`,
    headers: {
      'Content-Type': 'application/json'
    },
  };
  const response: AxiosResponse = await axios.request(config);
  return response.data;
};


export const deleteTripDetails = async (tripId: string): Promise<void> => {
  const config: AxiosRequestConfig = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/trip/${tripId}`,
    headers: {
      'Content-Type': 'application/json'
    },
  };
  await axios.request(config);

};

