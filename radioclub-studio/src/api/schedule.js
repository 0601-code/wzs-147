import request from '@/utils/request'

export const getAnchorScheduleList = (params) => {
  return request({
    url: '/anchor-schedules',
    method: 'get',
    params,
  })
}

export const createAnchorSchedule = (data) => {
  return request({
    url: '/anchor-schedules',
    method: 'post',
    data,
  })
}

export const updateAnchorSchedule = (id, data) => {
  return request({
    url: `/anchor-schedules/${id}`,
    method: 'put',
    data,
  })
}

export const deleteAnchorSchedule = (id) => {
  return request({
    url: `/anchor-schedules/${id}`,
    method: 'delete',
  })
}

export const getAnchorList = () => {
  return request({
    url: '/anchors',
    method: 'get',
  })
}

export const getWeeklySchedule = (params) => {
  return request({
    url: '/anchor-schedules/weekly',
    method: 'get',
    params,
  })
}
