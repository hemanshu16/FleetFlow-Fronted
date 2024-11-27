import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import TripForm from './Form';

const TripsDetailsForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
         + Trip Details
      </Button>
      <Modal title="Trip Details" open={isModalOpen} onOk={handleOk}  okText="submit" onCancel={handleCancel}>
        <TripForm />
      </Modal>
    </>
  );
};

export default TripsDetailsForm;