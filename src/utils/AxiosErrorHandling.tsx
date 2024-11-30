import axios from "axios";


const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            return error.response.data.message;
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    } else {
        console.error('Non-Axios error:', error);
    }
    return 'Sorry for Inconvenience, An unexpected error occurred.';
};

export default handleAxiosError;