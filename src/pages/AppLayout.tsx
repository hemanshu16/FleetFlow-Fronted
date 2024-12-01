import { FC } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import './AppLayout.css';
import TripPage from './TripPage';

const { Header, Content, Footer } = Layout;

const AppLayout: FC = () => {

  // const [tripDetails,setT]/

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
        <h1>Fleet Flow</h1>
      </Header>
      <Content className='ant-layout-content'>
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
          <TripPage />
        </div>

      </Content>
      <Footer style={{ textAlign: 'center' }}>
        FleetFlow ©{new Date().getFullYear()} Created by 73 Systems
      </Footer>
    </Layout>
  );
};

export default AppLayout;

