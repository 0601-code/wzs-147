import request from '@/utils/request'

export const getDashboardStats = () => {
  return request({
    url: '/dashboard/stats',
    method: 'get',
  })
}

export const getRecentBroadcasts = () => {
  return request({
    url: '/dashboard/recent-broadcasts',
    method: 'get',
  })
}

export const getArticleStats = () => {
  return request({
    url: '/dashboard/article-stats',
    method: 'get',
  })
}

export const getEquipmentStats = () => {
  return request({
    url: '/dashboard/equipment-stats',
    method: 'get',
  })
}

export const getWeeklyBroadcastChart = () => {
  return request({
    url: '/dashboard/weekly-broadcast',
    method: 'get',
  })
}
