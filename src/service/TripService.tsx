import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import TripDetailRequest from '../models/TripDetailRequest';
import { Trip, TripDetails } from '../pages/TripsDetails';

const baseUrl = "http://54.162.51.81:8000";



// Function to send a message
export const saveTripDetails = async (requestData: TripDetailRequest): Promise<Trip> => {
  // Prepare the data with type annotation
  const data: string = JSON.stringify(requestData);

  const methodType : string = requestData.id != undefined ? "put" : "post";

  // Define the Axios request configuration with type safety
  const config: AxiosRequestConfig = {
    method: methodType,
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/trip`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data,
  };

  const response: AxiosResponse = await axios.request(config);
  return response.data;

};


export const getTripDetails = async (pageNo: number, pageSize: number, order: string): Promise<TripDetails> => {
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

