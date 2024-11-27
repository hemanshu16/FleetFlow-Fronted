import React from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';


const TripForm: React.FC = () => {
    const [form] = Form.useForm();


    return (
        <Form layout="vertical" form={form} name='Trip Details'>
            {/* VIN Number */}
            <Form.Item label="VIN Number" name="vinNumber" rules={[{ required: true, message: 'Please select a VIN number!' }]}>
                <Select placeholder="Select VIN Number" showSearch>
                    {/* Options for VIN Numbers */}
                    <Select.Option value="vin1">VIN12345</Select.Option>
                    <Select.Option value="vin2">VIN67890</Select.Option>
                </Select>
            </Form.Item>

            {/* IMEI Number */}
            <Form.Item label="IMEI Number" name="imeiNumber" rules={[{ required: true, message: 'Please select an IMEI number!' }]}>
                <Select placeholder="Select IMEI Number" showSearch>
                    {/* Options for IMEI Numbers */}
                    <Select.Option value="imei1">IMEI123456789</Select.Option>
                    <Select.Option value="imei2">IMEI987654321</Select.Option>
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
                            ({ getFieldValue }) => ({

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


            <Form.Item label="Mobile Number">
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="countryCode"
                            noStyle
                            rules={[{ required: true, message: 'Please select a country code!' }]}
                        >
                            <Select placeholder="+91" showSearch>
                                <Select.Option value="+1">+1 (USA)</Select.Option>
                                <Select.Option value="+44">+44 (UK)</Select.Option>
                                <Select.Option value="+91">+91 (India)</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name="mobileNumber"
                            noStyle
                            rules={[
                                { required: true, message: 'Please enter your mobile number!' },
                                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
                            ]}
                        >
                            <Input placeholder="Enter Mobile Number" />
                        </Form.Item>
                    </Col>
                </Row>
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