type TripDetailRequest = {
    "imei_number" : string,
    "vehicle_identification_number" : string,
    "start_time" : Date,    
    "end_time" : Date,
    "client_id" : string,
    "id" : string | undefined,
    "days" : string[],
    "operator_phone_number" : string
 }
 
 export default TripDetailRequest;