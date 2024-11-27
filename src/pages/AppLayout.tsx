import { FC } from 'react';
import { Breadcrumb, DatePicker, Layout, theme } from 'antd';
import './AppLayout.css';
import TripsDetails from './TripsDetails';
import DateTimePicker from './DateTimePicker';
import TripsDetailsForm from './TripDetailsForm';

const { Header, Content, Footer } = Layout;

const AppLayout: FC = () => {


    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

      return (
        <Layout>
          <Header style={{ display: 'flex', alignItems: 'center',backgroundColor : 'white' }}>
            <h1>Fleet Flow</h1>
          </Header>
          <Content style={{ padding: '0 48px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Trips</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                background: colorBgContainer,
                minHeight: 280,
                padding: 8,
                borderRadius: borderRadiusLG,
              }}
            >
              <div style={{"display" : "flex", justifyContent:"space-between"}}>
              <DateTimePicker />
              <TripsDetailsForm />
              </div>
              <TripsDetails />

            </div>

          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      );
    };

export default AppLayout;
