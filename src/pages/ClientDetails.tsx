import React, { useEffect, useState } from "react";
import { Modal, notification, Table } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import handleAxiosError from "../utils/AxiosErrorHandling";
import { deleteClientDetails, getAllClientDetails } from "../service/ClientService";

const useStyle = createStyles(({ css}) => {
  return {
    customTable: css`
      ant-table {
      ant-table-container {
          ant-table-body,
          ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

export interface ClientDetail {
  id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}

export interface Trip {
  id: string;
  imei_number: string;
  vehicle_identification_number: string;
  start_time: string;
  end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  client_details: ClientDetail;
}


export interface TripDetails {
  "trip_details": Trip[]
  "page_no": number,
  "page_size": number,
  "total_pages": number,
  "total_elements":number
}

type TripDetailsProps = {
  setClientDetails :  React.Dispatch<React.SetStateAction<ClientDetail[]>>
  clientDetails : ClientDetail[]
  totalElemants : number
  setTotalElements : React.Dispatch<React.SetStateAction<number>>
  setEditClientDetails : React.Dispatch<React.SetStateAction<ClientDetail|undefined>> 
  setIsModalOpen : React.Dispatch<React.SetStateAction<boolean>>
}


const ClientDetailsSection: React.FC<TripDetailsProps> = ({clientDetails,setClientDetails,setTotalElements,setEditClientDetails,setIsModalOpen}) => {
  const { styles } = useStyle();

  const [clientInfo, setClientInfo] = useState<ClientDetail>();

  const [api, contextHolder] = notification.useNotification();


  const [pageReload] = useState<number>(0);
  const [isModalOpen, setDeleteModalOpen] = useState(false);

  const showModal = (record: ClientDetail) => {
    setClientInfo(record);
    setDeleteModalOpen(true);
  };

  const handleOk = async () => {


     try {
      await deleteClientDetails(clientInfo?.id!);
      api.success({
        message: 'Client Details Deleted SuccessFully',
      });

      setClientDetails((oldDetails) => {
          const newDetails : ClientDetail[] = new Array();
          oldDetails.forEach((clientData:ClientDetail) => {
            if(clientData.id != clientInfo?.id)
            {
              newDetails.push(clientData);
            }
          })
          return newDetails;
      })
    
      setTotalElements(elemant => elemant-1);
      // fetchTripDetails(currentPage,pageSize);
  
    } catch (error) {
      if (error instanceof Error) {
        api.error({
          message: handleAxiosError(error),
        });
      }
    }
    finally {
      // setLoading(false);
    }
    setDeleteModalOpen(false);
  };

  const handleCancel = () => {
    setDeleteModalOpen(false);
  };

  const columns: TableColumnsType<ClientDetail> = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 150,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
    },
   
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (_, record) => <div style={{ display: "flex", justifyContent: "space-between" }}> <a style={{ color: "blue" }}><EditOutlined  onClick={() => { console.log(record); setEditClientDetails(record); setIsModalOpen(true);}}/> </a>  <a style={{ color: "red" }} onClick={() => showModal(record)}><DeleteOutlined /></a></div>,
    },
  ];

 


  useEffect(() => {
      fetchClientDetails();
  }, [pageReload]);

  const fetchClientDetails = async  () => {
     getAllClientDetails().then((data: ClientDetail[]) => {
      setClientDetails(data);
      setTotalElements(data.length)
    });
  }

  return (
    <>
    {contextHolder}
      <Table<ClientDetail>
        className={styles.customTable}
        dataSource={clientDetails}
        rowKey="id"
        // pagination={{
        //   // current: currentPage + 1,
        //   // pageSize: pageSize,
        //   // pageSizeOptions: [5, 10, 20, 50],
        //   // total: totalElemants,
        //   // showSizeChanger: true, // Allow user to change pageSize
        // }}
        // onChange={handleTableChange}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
      <Modal title="Delete Trip Details" open={isModalOpen} onOk={handleOk} okText="Yes" onCancel={handleCancel}>
        <p>You want to delete the following Client Information:</p>
        <ul>
          <li><strong>First Name:</strong> {clientInfo?.first_name}</li>
          <li><strong>Last Name:</strong> {clientInfo?.last_name}</li>
          <li><strong>Mobile Number:</strong> {clientInfo?.phone_number}</li>
        </ul>
        <p>Are you sure?</p>
      </Modal>
    </>
  );
};

export default ClientDetailsSection;
