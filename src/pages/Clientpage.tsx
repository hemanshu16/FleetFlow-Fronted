import React, { useState } from 'react'
import ClientDetailsSection,{ ClientDetail }  from './ClientDetails';
import ClientDetailsForm from './ClientDetailsForm';

const ClientPage: React.FC = () => {

    const [clientDetails, setClientDetails] = useState<ClientDetail[]>([]);
    const [totalElemants,setTotalElemants] = useState<number>(0);
    const [editClientDetails, setEditClientDetails] = useState<ClientDetail>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (<>
        <div style={{ "display": "flex", marginLeft: "6px", marginRight: "6px", justifyContent: "space-between", alignItems: "center" }}>
            <div><h2>Client Details</h2></div>
            <div><ClientDetailsForm setClientDetails={setClientDetails} 
            setTotalElements={setTotalElemants} 
            editClientDetails={editClientDetails}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setEditClientDetails={setEditClientDetails}
            />
            </div>
        </div>
        <ClientDetailsSection clientDetails={clientDetails} 
        setClientDetails={setClientDetails} 
        totalElemants={totalElemants} 
        setTotalElements={setTotalElemants}
        setEditClientDetails={setEditClientDetails}
        setIsModalOpen={setIsModalOpen}
        />
    </>
    )
}

export default ClientPage;