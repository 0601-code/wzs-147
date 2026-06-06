import { Menu } from 'antd'
import { useUser } from '@/contexts'
import { getMenuByRole } from '@/router/menuConfig'

const SideMenu = ({ selectedKey, onMenuClick }) => {
  const { user } = useUser()
  const menuItems = getMenuByRole(user?.role || 'student')

  const getSelectedKeys = () => {
    const key = menuItems.find((item) => selectedKey.startsWith(item.key))
    return key ? [item.key] : [menuItems[0]?.key]
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={getSelectedKeys()}
      items={menuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      }))}
      onClick={onMenuClick}
    />
  )
}

export default SideMenu
