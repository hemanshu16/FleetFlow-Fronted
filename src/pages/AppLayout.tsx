import { FC } from 'react';
import { Breadcrumb, Layout, Menu, Space, theme } from 'antd';
import './AppLayout.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const AppLayout: FC = () => {

  // const [tripDetails,setT]/

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const location = useLocation();

  // Get path segments from the current URL
  const pathSegments = location.pathname.split('/').filter((segment) => segment);


  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#001529',height:"64px" }}>
        {/* Brand Name */}
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Fleet Flow
        </div>

        {/* Navigation Menu */}
        <Menu theme="dark" mode="horizontal" style={{ minWidth: '300px', justifyContent: 'end' }}>
          <Menu.Item key="trips">
            <Link to="/trips">Trips</Link>
          </Menu.Item>
          <Menu.Item key="client">
            <Link to="/client">Clients</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className='ant-layout-content'>
        <Breadcrumb style={{ margin: '16px 16px' }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          {pathSegments.map((segment, index) => {
            // Build the path up to the current segment
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;

            return (
              <Breadcrumb.Item key={index}>
                <Link to={url}>{segment.charAt(0).toUpperCase() + segment.slice(1)}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 'calc(100vh - 64px - 75px - 70px)',
            border:"1px solid #001529",
            padding: 8,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>

      </Content>
      <Footer style={{
      backgroundColor: '#001529',
      color: 'white',
      textAlign: 'center',
      padding: '15px 15px',
      width: '100%',
      height:'75px',
      position: 'relative',
      bottom: 0,
    }}>
      
      <Space direction="vertical" size="small" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>© {new Date().getFullYear()} FleetFlow. All rights reserved.</div>
        <div>Created by 73 Systems LLP</div>
      </Space>
    </Footer>
    </Layout>
  );
};

export default AppLayout;

