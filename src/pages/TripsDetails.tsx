import React, { useEffect, useState } from "react";
import { Modal, notification, Table } from "antd";
import { deleteTripDetails, getTripDetails } from "../service/TripService";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { createStyles } from "antd-style";
import { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import handleAxiosError from "../utils/AxiosErrorHandling";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

interface ClientDetails {
  id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}

interface Trip {
  id: string;
  imei_number: string;
  vehicle_identification_number: string;
  start_time: string;
  end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  client_details: ClientDetails;
}

interface TripDetails {
  "trip_details": Trip[]
  "page_no": number,
  "page_size": number,
  "total_pages": number,
}




const TripDetails: React.FC = () => {
  const { styles } = useStyle();
  const [tripDetails, setTripDetails] = useState<Trip[]>([]);
  const [trip, setTrip] = useState<Trip>();

  const [api, contextHolder] = notification.useNotification();
  const [totalElemants, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5); // Default pageSize

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record: Trip) => {
    setTrip(record);
    setIsModalOpen(true);
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

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      render: (start_time, record) => (
        <>
          <div>{start_time}</div>
          {record.actual_start_time && (
            <>
              <hr></hr>
              <div style={{ color: "gray" }}>
                Actual: {record.actual_start_time}
              </div>
            </>
          )}
        </>
      ),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (end_time, record) => (
        <>
          <div>{end_time}</div>
          {record.actual_end_time && (
            <>
              <hr>
              </hr>
              <div style={{ color: "bold" }}>
                Actual: {record.actual_end_time}
              </div>
            </>
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (_, record) => <div style={{ display: "flex", justifyContent: "space-between" }}> <a style={{ color: "blue" }}><EditOutlined /> </a>  <a style={{ color: "red" }} onClick={() => showModal(record)}><DeleteOutlined /></a></div>,
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Trip> | SorterResult<Trip>[],
    extra: TableCurrentDataSource<Trip>
  ) => {
    // Use pagination.current with a fallback to the currentPage state
    const current = pagination.current || currentPage;
    const size = pagination.pageSize || pageSize;

    // if(current)
    setCurrentPage(current - 1);
    setPageSize(size);
  };


  useEffect(() => {
      fetchTripDetails(currentPage,pageSize);
  }, [currentPage, pageSize]);

  const fetchTripDetails = async  (currentPage : number, pageSize : number) => {
      await getTripDetails(currentPage, pageSize, "ASC").then((data: TripDetails) => {
      setTripDetails(data.trip_details);
      setTotal(data.total_pages*pageSize)
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
          <li><strong>Start Time:</strong> {trip?.start_time}</li>
          <li><strong>End Time:</strong> {trip?.end_time}</li>
          {trip?.actual_start_time && (
            <li><strong>Actual Start Time:</strong> {trip.actual_start_time}</li>
          )}
          {trip?.actual_end_time && (
            <li><strong>Actual End Time:</strong> {trip.actual_end_time}</li>
          )}
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

export default TripDetails;
