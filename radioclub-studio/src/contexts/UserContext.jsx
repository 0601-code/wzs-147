import { createContext, useContext, useState, useEffect } from 'react'
import { storage, constants } from '@/utils'
import { userApi } from '@/api'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = storage.getToken()
    const userInfo = storage.getUserInfo()
    if (token && userInfo) {
      setUser(userInfo)
    }
    setLoading(false)
  }, [])

  const login = async (loginData) => {
    const res = await userApi.login(loginData)
    if (res?.token) {
      storage.setToken(res.token)
    }
    const userInfo = res?.user || res
    storage.setUserInfo(userInfo)
    setUser(userInfo)
    return userInfo
  }

  const logout = async () => {
    try {
      await userApi.logout()
    } catch (e) {
      console.error('logout error', e)
    }
    storage.clearStorage()
    setUser(null)
  }

  const updateUserInfo = (userInfo) => {
    storage.setUserInfo(userInfo)
    setUser(userInfo)
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.role === role
  }

  const isTeacher = () => hasRole(constants.ROLE_TEACHER)
  const isAnchor = () => hasRole(constants.ROLE_ANCHOR)
  const isStudent = () => hasRole(constants.ROLE_ANCHOR)
  const isEquipmentAdmin = () => hasRole(constants.ROLE_EQUIPMENT_ADMIN)
  const isAdmin = () => hasRole(constants.ROLE_EQUIPMENT_ADMIN)

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserInfo,
    hasRole,
    isTeacher,
    isAnchor,
    isStudent,
    isEquipmentAdmin,
    isAdmin,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
