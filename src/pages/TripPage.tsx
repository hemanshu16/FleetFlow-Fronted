import React, { useState } from 'react'
import TripsDetailsForm from './TripDetailsForm'
import TripDetailsSection, { Trip } from './TripsDetails'

const TripPage: React.FC = () => {

    const [tripDetails, setTripDetails] = useState<Trip[]>([]);
    const [totalElemants,setTotalElemants] = useState<number>(0);

    return (<>
        <div style={{ "display": "flex", marginLeft: "6px", marginRight: "6px", justifyContent: "space-between", alignItems: "center" }}>
            <div><h2>Trip Details</h2></div>
            <div><TripsDetailsForm setTripDetails={setTripDetails} setTotalElements={setTotalElemants}/>
            </div>
        </div>
        <TripDetailsSection tripDetails={tripDetails} setTripDetails={setTripDetails} totalElemants={totalElemants} setTotalElements={setTotalElemants}/>
    </>
    )
}

export default TripPage