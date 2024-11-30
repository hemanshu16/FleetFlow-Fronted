import React, { useState } from 'react';
import { DatePicker } from 'antd';
import type { Moment } from 'moment';

const DateTimePicker: React.FC = () => {
  const [value, setValue] = useState<Moment | null>(null);

  const onChange = (date: Moment | null) => {
    setValue(date);
    console.log('Selected DateTime:', date ? date.format('YYYY-MM-DD HH:mm:ss') : 'None');
  };

  return (
    <DatePicker
      showTime={{ use12Hours: true, format: 'hh:mm:ss A' }}
      format="YYYY-MM-DD hh:mm:ss A Z"
      value={value}
      onChange={onChange}
      placeholder="Select Date and Time"
    />
  );
};

export default DateTimePicker;
