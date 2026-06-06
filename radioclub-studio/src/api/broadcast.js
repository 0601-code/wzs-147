import request from '@/utils/request'

export const getBroadcastLogList = (params) => {
  return request({
    url: '/broadcast-logs',
    method: 'get',
    params,
  })
}

export const getBroadcastLogDetail = (id) => {
  return request({
    url: `/broadcast-logs/${id}`,
    method: 'get',
  })
}

export const createBroadcastLog = (data) => {
  return request({
    url: '/broadcast-logs',
    method: 'post',
    data,
  })
}

export const updateBroadcastLog = (id, data) => {
  return request({
    url: `/broadcast-logs/${id}`,
    method: 'put',
    data,
  })
}

export const deleteBroadcastLog = (id) => {
  return request({
    url: `/broadcast-logs/${id}`,
    method: 'delete',
  })
}

export const startBroadcast = (id) => {
  return request({
    url: `/broadcast-logs/${id}/start`,
    method: 'post',
  })
}

export const endBroadcast = (id, data) => {
  return request({
    url: `/broadcast-logs/${id}/end`,
    method: 'post',
    data,
  })
}

export const getBroadcastStats = (params) => {
  return request({
    url: '/broadcast-logs/stats',
    method: 'get',
    params,
  })
}

export const getBroadcastList = (params) => {
  return getBroadcastLogList(params)
}

export const getBroadcastDetail = (id) => {
  return getBroadcastLogDetail(id)
}

export const createBroadcast = (data) => {
  return createBroadcastLog(data)
}

export const updateBroadcast = (id, data) => {
  return updateBroadcastLog(id, data)
}

export const deleteBroadcast = (id) => {
  return deleteBroadcastLog(id)
}
