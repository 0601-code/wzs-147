import { useState } from 'react'
import { Layout, theme } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import SideMenu from './SideMenu'
import HeaderBar from './HeaderBar'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout className="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="logo">
          <span className="logo-icon">📻</span>
          {!collapsed && <span>广播站管理</span>}
        </div>
        <SideMenu
          selectedKey={location.pathname}
          onMenuClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <HeaderBar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
