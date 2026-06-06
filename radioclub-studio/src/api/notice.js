import request from '@/utils/request'

export const getInterruptNoticeList = (params) => {
  return request({
    url: '/interrupt-notices',
    method: 'get',
    params,
  })
}

export const getInterruptNoticeDetail = (id) => {
  return request({
    url: `/interrupt-notices/${id}`,
    method: 'get',
  })
}

export const createInterruptNotice = (data) => {
  return request({
    url: '/interrupt-notices',
    method: 'post',
    data,
  })
}

export const updateInterruptNotice = (id, data) => {
  return request({
    url: `/interrupt-notices/${id}`,
    method: 'put',
    data,
  })
}

export const deleteInterruptNotice = (id) => {
  return request({
    url: `/interrupt-notices/${id}`,
    method: 'delete',
  })
}

export const broadcastInterruptNotice = (id) => {
  return request({
    url: `/interrupt-notices/${id}/broadcast`,
    method: 'post',
  })
}

export const cancelInterruptNotice = (id) => {
  return request({
    url: `/interrupt-notices/${id}/cancel`,
    method: 'post',
  })
}

export const getNoticeList = (params) => {
  return getInterruptNoticeList(params)
}

export const getNoticeDetail = (id) => {
  return getInterruptNoticeDetail(id)
}

export const createNotice = (data) => {
  return createInterruptNotice(data)
}

export const updateNotice = (id, data) => {
  return updateInterruptNotice(id, data)
}

export const deleteNotice = (id) => {
  return deleteInterruptNotice(id)
}

export const publishNotice = (id) => {
  return broadcastInterruptNotice(id)
}

export const getActiveNotices = () => {
  return request({
    url: '/interrupt-notices?status=pending',
    method: 'get',
  })
}
