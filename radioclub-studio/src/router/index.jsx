import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '@/contexts'
import { Spin } from 'antd'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import ProgramManage from '@/pages/ProgramManage'
import ProgramCalendar from '@/pages/ProgramCalendar'
import ArticleManage from '@/pages/ArticleManage'
import AnchorSchedule from '@/pages/AnchorSchedule'
import AudioManage from '@/pages/AudioManage'
import EquipmentManage from '@/pages/EquipmentManage'
import BorrowRecord from '@/pages/BorrowRecord'
import BroadcastRecord from '@/pages/BroadcastRecord'
import NoticeManage from '@/pages/NoticeManage'
import UserManage from '@/pages/UserManage'
import NotFound from '@/pages/NotFound'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return children
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<NotFound code="403" title="403" subTitle="抱歉，您没有权限访问此页面" />} />
      <Route path="/404" element={<NotFound />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="programs" element={<ProgramManage />} />
        <Route path="calendar" element={<ProgramCalendar />} />
        <Route path="articles" element={<ArticleManage />} />
        <Route path="schedule" element={<AnchorSchedule />} />
        <Route path="audios" element={<AudioManage />} />
        <Route path="equipment" element={<EquipmentManage />} />
        <Route path="borrow" element={<BorrowRecord />} />
        <Route path="broadcast" element={<BroadcastRecord />} />
        <Route path="notices" element={<NoticeManage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={['teacher']}>
              <UserManage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRouter
