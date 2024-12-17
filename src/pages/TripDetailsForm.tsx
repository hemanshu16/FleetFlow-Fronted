import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, notification, Row, Select, TimePicker, Typography } from 'antd';
import { getAllClientDetails } from '../service/ClientService';
import moment, { Moment } from 'moment';
import TripDetailRequest from '../models/TripDetailRequest';
import { saveTripDetails } from '../service/TripService';
import handleAxiosError from '../utils/AxiosErrorHandling';
import { Trip } from './TripsDetails';
import { ClientDetail } from './ClientDetails';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { countryCodes } from '../utils/Contant';
const { Title } = Typography;
const { Option } = Select;

type VinImeiPair = {
  vin: string; // VIN is a string
  imei: string; // IMEI is a string
};

type TripDetailsFormProps = {
  setTripDetails: React.Dispatch<React.SetStateAction<Trip[]>>
  setTotalElements: React.Dispatch<React.SetStateAction<number>>
  editTripDetails: Trip | undefined
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEditTripDetails: React.Dispatch<React.SetStateAction<Trip | undefined>>
}

const TripsDetailsForm: React.FC<TripDetailsFormProps> = ({ setTripDetails, setTotalElements, editTripDetails, isModalOpen, setIsModalOpen, setEditTripDetails }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  type VinImeiList = VinImeiPair[];

  const [clientDetails, setClientDetails] = useState<ClientDetail[]>();
  const [clientDetailsMap, setClientDetailsMap] = useState<Map<string, ClientDetail>>(new Map());

  const [api, contextHolder] = notification.useNotification();
  const [checkedList, setCheckedList] = useState<string[]>([]);


  useEffect(() => {
    const clientDetails = getAllClientDetails();
    clientDetails.then((details: ClientDetail[]) => {
      setClientDetails(details);
      const clientDetailsMap = new Map(details.map(detail => [detail.id, detail]));
      setClientDetailsMap(clientDetailsMap);
    })
  }, [])

  useEffect(() => {
    if (editTripDetails != undefined && isModalOpen) {
      const countryCodeLength = editTripDetails.operator_phone_number.length - 10;
      form.setFieldsValue({ mobile_number: editTripDetails?.client_details.phone_number })
      form.setFieldsValue({ name: editTripDetails?.client_details.first_name + " " + editTripDetails?.client_details.last_name })
      form.setFieldsValue({ vin_number: editTripDetails.vehicle_identification_number });
      form.setFieldsValue({ imei_number: editTripDetails.imei_number });
      setCheckedList(editTripDetails.days.split(","))
      form.setFieldsValue({ start_time: moment.utc(editTripDetails.start_time, "HH:mm:ss").local() });
      form.setFieldsValue({ end_time: moment.utc(editTripDetails.end_time, "HH:mm:ss").local() });
      form.setFieldsValue({ country_code: editTripDetails.operator_phone_number.substring(0,countryCodeLength) })
      form.setFieldsValue({ operator_phone_number: editTripDetails.operator_phone_number.substring(countryCodeLength)});
    }

  }, [editTripDetails?.id]);

  const vinImeiListPair: VinImeiList = [
    {
      "vin": "1FDSS3IL96DA65164",
      "imei": "862255068805560"
    },
    {
      "vin": "1FBZX2ZM0FKA22036",
      "imei": "864486065879344"
    },
    {
      "vin": "1FBZX2ZM8GKA55223",
      "imei": "864486065893857"
    },
    {
      "vin": "1FBZX2ZM5KKB84254",
      "imei": "864486065903300"
    },
    {
      "vin": "1FBZX2ZM3FKA75524",
      "imei": "866016061315049"
    },
    {
      "vin": "1FBZX2ZM3JKA42967",
      "imei": "866016061329172"
    },
    {
      "vin": "1FBZX2ZM3GKA11906",
      "imei": "866392065840674"
    }
  ]


  const vinToImeiMapping: Record<string, string> = vinImeiListPair.reduce(
    (acc, { vin, imei }) => {
      acc[vin] = imei;
      return acc;
    },
    {} as Record<string, string>
  );

  // Reverse mapping for convenience
  const imeiToVinMapping = Object.fromEntries(
    Object.entries(vinToImeiMapping).map(([vin, imei]) => [imei, vin])
  );

  const handleVinChange = (value: string) => {
    const mappedImei = vinToImeiMapping[value];
    form.setFieldsValue({ imei_number: mappedImei });
  };

  const handleImeiChange = (value: string) => {
    const mappedVin = imeiToVinMapping[value];
    form.setFieldsValue({ vin_number: mappedVin });
  };

  const handleNameOrMobileChange = (clientId: string) => {
    const details = clientDetailsMap.get(clientId);
    form.setFieldsValue({ name: details?.first_name + " " + details?.last_name });
    form.setFieldsValue({ mobile_number: details?.phone_number })
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((_) => submitFormDetails()).catch((errorInfo) => {
      console.log(errorInfo)
    });
  };

  const getClientIdFromPhoneNumber = (phoneNumber: string) => {
    //TODO : give notification that client details deleted now not exist
    return clientDetails?.filter(clientDetail => clientDetail.phone_number === phoneNumber)[0].id;
  }




  const submitFormDetails = async () => {
    const tripDetails = form.getFieldsValue();
    const client_id: string | undefined = getClientIdFromPhoneNumber(tripDetails["mobile_number"]);

    const tripDetailsRequestDetails: TripDetailRequest = {
      client_id: client_id || "",
      start_time: tripDetails.start_time.toISOString().split("T")[1].split(".")[0],
      end_time: tripDetails.end_time.toISOString().split("T")[1].split(".")[0],
      imei_number: tripDetails.imei_number,
      vehicle_identification_number: tripDetails.vin_number,
      days: checkedList,
      id: editTripDetails?.id,
      operator_phone_number : tripDetails.country_code+tripDetails.operator_phone_number
    }

    setLoading(true);
    try {

      const savedTripDetails: Trip = await saveTripDetails(tripDetailsRequestDetails);
      api.success({
        message: 'Trip Saved SuccessFully',
      });

      setIsModalOpen(false);
      form.resetFields();

      if (editTripDetails == undefined) {
        setTripDetails((oldTripDetails: Trip[]) => {
          return [...oldTripDetails, savedTripDetails];
        })
      }
      else {
        setTripDetails((oldTripDetails: Trip[]) => {
          const newDetails = oldTripDetails.map((data: Trip) => {
            if (data.id == editTripDetails.id) {
              return savedTripDetails;
            }
            else {
              return data;
            }
          })
          return newDetails;
        })
      }

      form.setFieldsValue({});
      setEditTripDetails(undefined);
      setTotalElements(elemants => elemants + 1);

    } catch (error) {
      if (error instanceof Error) {
        api.error({
          message: handleAxiosError(error),
        });
      }
    }
    finally {
      setLoading(false);
    }
  }

  const onChangeDays = (list: string[]) => {
    setCheckedList(list);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditTripDetails(undefined);
    console.log("Closed");
    form.resetFields();
  };


  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal}>
        + Trip Details
      </Button>
      <Modal open={isModalOpen} onOk={handleOk} okText={editTripDetails != undefined ? "save" : "submit"} okButtonProps={{
        loading, // Controls the loading state on the OK button
        disabled: loading, // Optionally disable the button while loading
      }} onCancel={handleCancel}>
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
          Trip Details
        </Title>
        <Form layout="vertical" form={form} name='Trip Details'>
          <Form.Item label="VIN Number" name="vin_number" rules={[{ required: true, message: 'Please select a VIN number!' }]}>
            <Select placeholder="Select VIN Number" onChange={handleVinChange} showSearch>
              {vinImeiListPair.map(item => <Select.Option value={item.vin}>{item.vin}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="IMEI Number" name="imei_number" rules={[{ required: true, message: 'Please select an IMEI number!' }]}>
            <Select placeholder="Select IMEI Number" onChange={handleImeiChange} showSearch>
              {vinImeiListPair.map(item => <Select.Option value={item.imei}>{item.imei}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Select Days" name="days" rules={[
            {
              validator: (_, ) => {
                if (checkedList.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("End time must be after start time!"));
              },
            }

          ]}>
            <Row justify="space-between">
              <Checkbox.Group onChange={onChangeDays} value={checkedList}
                options={[
                  { label: 'Mon', value: '2' },
                  { label: 'Tue', value: '3' },
                  { label: 'Wed', value: '4' },
                  { label: 'Thu', value: '5' },
                  { label: 'Fri', value: '6' },
                  { label: 'Sat', value: '7' },
                  { label: 'Sun', value: '1' },
                ]}
              />
            </Row>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="start_time"
                rules={[{ required: true, message: "Please select start time!" }]}
              
              >
                <TimePicker use12Hours format="h:mm A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="end_time"
              
                rules={[
                  { required: true, message: "Please select end time!" },
                  {
                    validator: (_, value) => {
                      const startTime: Moment = form.getFieldValue("start_time");
                      if (!startTime || !value || value.isAfter(startTime)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("End time must be after start time!"));
                    },
                  },
                ]}
              >
                <TimePicker use12Hours format="h:mm A" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Operator Phone Number">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="country_code"
                  rules={[{ required: true, message: 'Please select a country code!' }]}
                  noStyle
                >
                  <Select placeholder="Code">
                    {countryCodes.map((item) => (
                      <Option key={item.code} value={item.code}>
                        {item.code} ({item.country})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item
                  name="operator_phone_number"
                  rules={[
                    { required: true, message: 'Please enter operator phone number!' },
                    {
                      pattern: /^\d{10}$/,
                      message: 'Phone number must be exactly 10 digits!',
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please select your name!' }]}
          >
            <Select placeholder="Select Client Name" showSearch={true} onChange={handleNameOrMobileChange} loading={clientDetails == undefined} disabled={clientDetails == undefined}>
              {clientDetails ? (
                clientDetails.map((details, index) => (
                  <Select.Option key={index} value={details.id}>
                    {details.first_name + " " + details.last_name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Loading names...
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobile_number"
            rules={[
              { required: true, message: 'Please enter your mobile number!' }
            ]}
          >
            <Select placeholder="Select Phone Number" showSearch={true} onChange={handleNameOrMobileChange} loading={clientDetails == undefined} disabled={clientDetails == undefined}>
              {clientDetails ? (
                clientDetails.map((details, index) => (
                  <Select.Option key={index} value={details.id}>
                    {details.phone_number}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Loading phone Numbers ...
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TripsDetailsForm;