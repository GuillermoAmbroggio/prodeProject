import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntdLayout, Breadcrumb } from 'antd';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';

interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({}) => {
  const { Content, Footer } = AntdLayout;

  return (
    <div>
      <AntdLayout style={{ minHeight: '100vh' }}>
        <Sidebar />

        <AntdLayout className="site-layout">
          <Header />

          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Tu pronostico ©2022 Created by Guillermo Ambroggio
          </Footer>
        </AntdLayout>
      </AntdLayout>
    </div>
  );
};

export default Layout;
