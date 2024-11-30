import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import { getAllClientDetails } from '../service/ClientService';
import ClientDetail from '../models/ClientDetail';

type VinImeiPair = {
    vin: string; // VIN is a string
    imei: string; // IMEI is a string
};

type TripFormProps = {
    form: any;  // Form instance passed from parent
};

const TripForm: React.FC<TripFormProps> = () => {
    const [form] = Form.useForm();
    type VinImeiList = VinImeiPair[];
    const [clientDetails, setClientDetails] = useState<ClientDetail[]>();
    const [clientDetailsMap, setClientDetailsMap] = useState<Map<string, ClientDetail>>(new Map());


    useEffect(() => {
        const clientDetails = getAllClientDetails();
        clientDetails.then((details: ClientDetail[]) => {
            setClientDetails(details);
            const clientDetailsMap = new Map(details.map(detail => [detail.id, detail]));
            setClientDetailsMap(clientDetailsMap);
        })
    }, [])


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
        form.setFieldsValue({ imeiNumber: mappedImei });
    };

    const handleImeiChange = (value: string) => {
        const mappedVin = imeiToVinMapping[value];
        form.setFieldsValue({ vinNumber: mappedVin });
    };

    const handleNameOrMobileChange = (clientId: string) => {
        const details = clientDetailsMap.get(clientId);
        form.setFieldsValue({ name: details?.first_name + " " + details?.last_name });
        form.setFieldsValue({ mobileNumber: details?.phone_number })
    }


    return (
        <Form layout="vertical" form={form} name='Trip Details'>
            {/* VIN Number */}
            <Form.Item label="VIN Number" name="vinNumber" rules={[{ required: true, message: 'Please select a VIN number!' }]}>
                <Select placeholder="Select VIN Number" onChange={handleVinChange} showSearch>
                    {vinImeiListPair.map(item => <Select.Option value={item.vin}>{item.vin}</Select.Option>)}
                </Select>
            </Form.Item>

            {/* IMEI Number */}
            <Form.Item label="IMEI Number" name="imeiNumber" rules={[{ required: true, message: 'Please select an IMEI number!' }]}>
                <Select placeholder="Select IMEI Number" onChange={handleImeiChange} showSearch>
                    {vinImeiListPair.map(item => <Select.Option value={item.imei}>{item.imei}</Select.Option>)}
                </Select>
            </Form.Item>

            {/* Start Date and End Date */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a start date and time!',
                            },
                            ({}) => ({

                                validator(_, value) {
                                    if (!value || value.isAfter(moment())) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Start time must be in the future!'));
                                },
                            }),
                        ]}

                    >
                        <DatePicker
                            use12Hours
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD hh:mm:ss" // Customize format as needed
                            placeholder="Select Start Date"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please select an end date and time!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const startDateTime = getFieldValue('startDate');
                                    console.log(startDateTime)
                                    if (!value || !startDateTime || value.isAfter(startDateTime)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('End time must be greater than start time!'));
                                },
                            }),
                        ]}>
                        <DatePicker
                            use12Hours
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD hh:mm:ss" // Customize format as needed
                            placeholder="Select End Date"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please select your name!' }]}
            >
                <Select placeholder="Select Client Name" onChange={handleNameOrMobileChange} loading={clientDetails == undefined} disabled={clientDetails == undefined}>
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
                name="mobileNumber"
                rules={[
                    { required: true, message: 'Please enter your mobile number!' }
                ]}
            >
                <Select placeholder="Select Phone Number" onChange={handleNameOrMobileChange} loading={clientDetails == undefined} disabled={clientDetails == undefined}>
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


            {/* sSubmit Button */}
            {/* <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item> */}
        </Form>

        
    );
};

export default TripForm;