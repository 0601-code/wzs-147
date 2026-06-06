import { Button, Avatar, Dropdown, Space } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts'
import { constants } from '@/utils'

const HeaderBar = ({ collapsed, onToggle }) => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => {},
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => {},
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div className="header-right">
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="user-info">
            <Avatar icon={<UserOutlined />} src={user?.avatar} />
            <Space direction="vertical" size={0} style={{ display: 'flex', lineHeight: 1.2 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name || user?.username}</span>
              <span style={{ fontSize: 12, color: '#999' }}>
                {constants.ROLE_MAP[user?.role] || '用户'}
              </span>
            </Space>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default HeaderBar
