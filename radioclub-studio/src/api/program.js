import request from '@/utils/request'

export const getColumnList = (params) => {
  return request({
    url: '/columns',
    method: 'get',
    params,
  })
}

export const getColumnDetail = (id) => {
  return request({
    url: `/columns/${id}`,
    method: 'get',
  })
}

export const createColumn = (data) => {
  return request({
    url: '/columns',
    method: 'post',
    data,
  })
}

export const updateColumn = (id, data) => {
  return request({
    url: `/columns/${id}`,
    method: 'put',
    data,
  })
}

export const deleteColumn = (id) => {
  return request({
    url: `/columns/${id}`,
    method: 'delete',
  })
}

export const getProgramScheduleList = (params) => {
  return request({
    url: '/program-schedules',
    method: 'get',
    params,
  })
}

export const getProgramScheduleDetail = (id) => {
  return request({
    url: `/program-schedules/${id}`,
    method: 'get',
  })
}

export const createProgramSchedule = (data) => {
  return request({
    url: '/program-schedules',
    method: 'post',
    data,
  })
}

export const updateProgramSchedule = (id, data) => {
  return request({
    url: `/program-schedules/${id}`,
    method: 'put',
    data,
  })
}

export const deleteProgramSchedule = (id) => {
  return request({
    url: `/program-schedules/${id}`,
    method: 'delete',
  })
}

export const getCalendarData = (params) => {
  return request({
    url: '/program-schedules/calendar',
    method: 'get',
    params,
  })
}

export const getProgramList = (params) => {
  return getColumnList(params)
}

export const getProgramDetail = (id) => {
  return getColumnDetail(id)
}

export const createProgram = (data) => {
  return createColumn(data)
}

export const updateProgram = (id, data) => {
  return updateColumn(id, data)
}

export const deleteProgram = (id) => {
  return deleteColumn(id)
}

export const getProgramSchedule = (params) => {
  return getProgramScheduleList(params)
}
