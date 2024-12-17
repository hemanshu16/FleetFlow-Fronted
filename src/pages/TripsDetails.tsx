import React, { useEffect, useState } from "react";
import { Modal, notification, Table } from "antd";
import { deleteTripDetails, getTripDetails } from "../service/TripService";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { createStyles } from "antd-style";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import handleAxiosError from "../utils/AxiosErrorHandling";
import { ClientDetail } from "./ClientDetails";
import moment from "moment";

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

const daysOfWeek = new Array<string>("SUN","MON","TUE","WED","THU","FRI","SAT");

export interface Trip {
  id: string;
  imei_number: string;
  vehicle_identification_number: string;
  start_time: string;
  end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  client_details: ClientDetail;
  days : string,
  operator_phone_number : string
}


export interface TripDetails {
  "trip_details": Trip[]
  "page_no": number,
  "page_size": number,
  "total_pages": number,
  "total_elements":number
}

type TripDetailsProps = {
  setTripDetails :  React.Dispatch<React.SetStateAction<Trip[]>>
  tripDetails : Trip[]
  totalElemants : number
  setTotalElements : React.Dispatch<React.SetStateAction<number>>
  setEditTripDetails : React.Dispatch<React.SetStateAction<Trip|undefined>> 
  setIsModalOpen : React.Dispatch<React.SetStateAction<boolean>>
}


const TripDetailsSection: React.FC<TripDetailsProps> = ({tripDetails,setTripDetails,totalElemants,setTotalElements,setEditTripDetails,setIsModalOpen}) => {
  const { styles } = useStyle();

  const [trip, setTrip] = useState<Trip>();

  const [api, contextHolder] = notification.useNotification();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5); // Default pageSize
  const [pageReload, setPageReload] = useState<number>(0);
  const [isModalOpen, setDeleteModalOpen] = useState(false);

  const showModal = (record: Trip) => {
    setTrip(record);
    setDeleteModalOpen(true);
  };

  const handleOk = async () => {


     try {
      await deleteTripDetails(trip?.id!);
      api.success({
        message: 'Trip Deleted SuccessFully',
      });

      setTripDetails((oldDetails) => {
          const newDetails : Trip[] = new Array();
          oldDetails.forEach((tripData:Trip) => {
            if(tripData.id != trip?.id)
            {
              newDetails.push(tripData);
            }
          })
          return newDetails;
      })
    
      setTotalElements(elemant => elemant-1);
      fetchTripDetails(currentPage,pageSize);
  
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

  const columns: TableColumnsType<Trip> = [
    {
      title: "Client Details",
      children: [
        {
          title: "First Name",
          dataIndex: ["client_details", "first_name"],
          key: "client_first_name",
        },
        {
          title: "Last Name",
          dataIndex: ["client_details", "last_name"],
          key: "client_last_name",
        },
        {
          title: "Phone Number",
          dataIndex: ["client_details", "phone_number"],
          key: "client_phone_number",
        },
      ],
    },
    {
      title: "Operator Phone Number",
      dataIndex: "operator_phone_number",
      key: "operator_phone_number",
      width: 150,
    },
    {
      title: "IMEI Number",
      dataIndex: "imei_number",
      key: "imei_number",
      width: 150,
    },
    {
      title: "Vehicle Identification Number",
      dataIndex: "vehicle_identification_number",
      key: "vehicle_identification_number",
      width: 200,
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (start_time) => (
        <>
          <div>{moment.utc(start_time,"HH:mm").local().format("hh:mm:ss A")}</div>
        </>
      ),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (end_time) => (
        <>
          <div>{moment.utc(end_time,"HH:mm").local().format("hh:mm:ss A")}</div>
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (_, record) => <div style={{ display: "flex", justifyContent: "space-between" }}> <a style={{ color: "blue" }}><EditOutlined  onClick={() => { console.log(record); setEditTripDetails(record); setIsModalOpen(true);}}/> </a>  <a style={{ color: "red" }} onClick={() => showModal(record)}><DeleteOutlined /></a></div>,
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig
  ) => {
    // Use pagination.current with a fallback to the currentPage state
    const current = pagination.current || currentPage;
    const size = pagination.pageSize || pageSize;

    // if(current)
    setCurrentPage(current - 1);
    setPageSize(size);
    setPageReload(oldPage => oldPage+1);
  };


  useEffect(() => {
      fetchTripDetails(currentPage,pageSize);
  }, [pageReload]);

  const fetchTripDetails = async  (currentPage : number, pageSize : number) => {
      await getTripDetails(currentPage, pageSize, "ASC").then((data: TripDetails) => {
      setTripDetails(data.trip_details);
      setTotalElements(data.total_elements)
    });
  }

  return (
    <>
    {contextHolder}
      <Table<Trip>
        className={styles.customTable}
        dataSource={tripDetails}
        rowKey="id"
        pagination={{
          current: currentPage + 1,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50],
          total: totalElemants,
          showSizeChanger: true, // Allow user to change pageSize
        }}
        onChange={handleTableChange}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
      <Modal title="Delete Trip Details" open={isModalOpen} onOk={handleOk} okText="Yes" onCancel={handleCancel}>
        <p>You want to delete the following Trip Information:</p>
        <ul>
          <li><strong>Trip ID:</strong> {trip?.id}</li>
          <li><strong>IMEI Number:</strong> {trip?.imei_number}</li>
          <li><strong>Vehicle Identification Number:</strong> {trip?.vehicle_identification_number}</li>
          <li><strong>Start Time:</strong> {moment.utc(trip?.start_time,"HH:mm").local().format("hh:mm:ss A")}</li>
          <li><strong>End Time:</strong> {moment.utc(trip?.end_time,"HH:mm").local().format("hh:mm:ss A")}</li>
          <li><strong>Days Of Week:</strong> {trip?.days.split(",").map((num : string) => daysOfWeek[parseInt(num)-1]).join(",")}</li>
          <li><strong>Operator phone number:</strong> {trip?.operator_phone_number}</li>
          <li>
            <strong>Client Details:</strong> {trip?.client_details?.first_name}{" "}
            {trip?.client_details?.last_name} ({trip?.client_details?.phone_number})
          </li>
        </ul>
        <p>Are you sure?</p>
      </Modal>
    </>
  );
};

export default TripDetailsSection;
