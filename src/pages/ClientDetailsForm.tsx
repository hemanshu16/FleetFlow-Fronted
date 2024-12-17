import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, notification, Row, Select } from 'antd';
import { saveClientDetails } from '../service/ClientService';
import handleAxiosError from '../utils/AxiosErrorHandling';
import { ClientDetail } from './ClientDetails';
import ClientDetailRequest from '../models/ClientDetailRequest';
import { countryCodes } from '../utils/Contant';

const { Option } = Select;


type TripDetailsFormProps = {
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetail[]>>
  setTotalElements: React.Dispatch<React.SetStateAction<number>>
  editClientDetails: ClientDetail | undefined
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEditClientDetails: React.Dispatch<React.SetStateAction<ClientDetail | undefined>>
}

const ClientDetailsForm: React.FC<TripDetailsFormProps> = ({ setClientDetails, setTotalElements, editClientDetails, isModalOpen, setIsModalOpen, setEditClientDetails }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();



  const [api, contextHolder] = notification.useNotification();




  if (editClientDetails != undefined && isModalOpen) {
    const countryCodeLength = editClientDetails.phone_number.length - 10;
    form.setFieldsValue({ country_code: editClientDetails.phone_number.substring(0,countryCodeLength) })
    form.setFieldsValue({ first_name : editClientDetails.first_name })
    form.setFieldsValue({ last_name:  editClientDetails.last_name});
    form.setFieldsValue({ phone_number: editClientDetails.phone_number.substring(countryCodeLength)});
  }




  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((_) => submitFormDetails()).catch((errorInfo) => {
      console.log(errorInfo)
    });
  };




  const submitFormDetails = async () => {

    const clientDetails: ClientDetail&{country_code : string}  = form.getFieldsValue();

    const clientDetailsRequestDetails: ClientDetailRequest = {
      first_name: clientDetails.first_name,
      last_name: clientDetails.last_name,
      phone_number: clientDetails.country_code + clientDetails.phone_number,
      id: editClientDetails?.id
    }

    setLoading(true);
    try {

      const savedClientDetails: ClientDetail = await saveClientDetails(clientDetailsRequestDetails);
      api.success({
        message: 'Client Details Saved SuccessFully',
      });

      setIsModalOpen(false);
      form.resetFields();

      if (editClientDetails == undefined) {
        setClientDetails((oldTripDetails: ClientDetail[]) => {
          return [...oldTripDetails, savedClientDetails];
        })
      }
      else {
        setClientDetails((oldTripDetails: ClientDetail[]) => {
          const newDetails = oldTripDetails.map((data: ClientDetail) => {
            if (data.id == editClientDetails.id) {
              return savedClientDetails;
            }
            else {
              return data;
            }
          })
          return newDetails;
        })
      }
 
      form.resetFields();
      
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditClientDetails(undefined);
    console.log("Closed");
    form.resetFields();
  };


  const handleSubmit = (values: any) => {
    console.log('Form Values:', values);
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal}>
        + Client Details
      </Button>
      <Modal title={editClientDetails != undefined ? "Edit Client Details" : "Add Client Details"} open={isModalOpen} onOk={handleOk} okText={editClientDetails != undefined ? "save" : "submit"} okButtonProps={{
        loading, // Controls the loading state on the OK button
        disabled: loading, // Optionally disable the button while loading
      }} onCancel={handleCancel}>
        <Form
          layout="vertical"
          form={form}
          name="User Details"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: 'Please enter your first name!' }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: 'Please enter your last name!' }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item label="Phone Number">
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
                  name="phone_number"
                  rules={[
                    { required: true, message: 'Please enter your phone number!' },
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
        </Form>
      </Modal>
    </>
  );
};

export default ClientDetailsForm;