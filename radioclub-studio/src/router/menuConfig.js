import {
  DashboardOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  SoundOutlined,
  ToolOutlined,
  SwapOutlined,
  HistoryOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { constants } from '@/utils'

const { ROLE_TEACHER, ROLE_ANCHOR, ROLE_EQUIPMENT_ADMIN } = constants

const menuConfig = [
  {
    key: '/dashboard',
    label: '首页',
    icon: <DashboardOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR, ROLE_EQUIPMENT_ADMIN],
  },
  {
    key: '/programs',
    label: '节目栏目管理',
    icon: <AppstoreOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR],
  },
  {
    key: '/calendar',
    label: '节目编排日历',
    icon: <CalendarOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR],
  },
  {
    key: '/articles',
    label: '稿件管理',
    icon: <FileTextOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR],
  },
  {
    key: '/schedule',
    label: '主播排班',
    icon: <TeamOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR],
  },
  {
    key: '/audios',
    label: '音频素材管理',
    icon: <SoundOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR, ROLE_EQUIPMENT_ADMIN],
  },
  {
    key: '/equipment',
    label: '设备管理',
    icon: <ToolOutlined />,
    roles: [ROLE_TEACHER, ROLE_EQUIPMENT_ADMIN],
  },
  {
    key: '/borrow',
    label: '设备借还登记',
    icon: <SwapOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR, ROLE_EQUIPMENT_ADMIN],
  },
  {
    key: '/broadcast',
    label: '播出记录',
    icon: <HistoryOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR, ROLE_EQUIPMENT_ADMIN],
  },
  {
    key: '/notices',
    label: '临时插播通知',
    icon: <BellOutlined />,
    roles: [ROLE_TEACHER, ROLE_ANCHOR],
  },
  {
    key: '/users',
    label: '用户管理',
    icon: <UserOutlined />,
    roles: [ROLE_TEACHER],
  },
]

export const getMenuByRole = (role) => {
  return menuConfig.filter((item) => item.roles.includes(role))
}

export default menuConfig
