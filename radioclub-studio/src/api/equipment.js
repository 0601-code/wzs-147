import request from '@/utils/request'

export const getEquipmentList = (params) => {
  return request({
    url: '/equipment',
    method: 'get',
    params,
  })
}

export const getEquipmentDetail = (id) => {
  return request({
    url: `/equipment/${id}`,
    method: 'get',
  })
}

export const createEquipment = (data) => {
  return request({
    url: '/equipment',
    method: 'post',
    data,
  })
}

export const updateEquipment = (id, data) => {
  return request({
    url: `/equipment/${id}`,
    method: 'put',
    data,
  })
}

export const deleteEquipment = (id) => {
  return request({
    url: `/equipment/${id}`,
    method: 'delete',
  })
}

export const getEquipmentBorrowList = (params) => {
  return request({
    url: '/equipment-borrows',
    method: 'get',
    params,
  })
}

export const getEquipmentBorrowDetail = (id) => {
  return request({
    url: `/equipment-borrows/${id}`,
    method: 'get',
  })
}

export const createEquipmentBorrow = (data) => {
  return request({
    url: '/equipment-borrows',
    method: 'post',
    data,
  })
}

export const updateEquipmentBorrow = (id, data) => {
  return request({
    url: `/equipment-borrows/${id}`,
    method: 'put',
    data,
  })
}

export const deleteEquipmentBorrow = (id) => {
  return request({
    url: `/equipment-borrows/${id}`,
    method: 'delete',
  })
}

export const returnEquipment = (id, data) => {
  return request({
    url: `/equipment-borrows/${id}/return`,
    method: 'post',
    data,
  })
}

export const getBorrowStats = () => {
  return request({
    url: '/equipment-borrows/stats',
    method: 'get',
  })
}

export const getBorrowList = (params) => {
  return getEquipmentBorrowList(params)
}

export const createBorrow = (data) => {
  return createEquipmentBorrow(data)
}

export const approveBorrow = (id) => {
  return request({
    url: `/equipment-borrows/${id}`,
    method: 'put',
    data: { status: 'borrowed' },
  })
}

export const rejectBorrow = (id, data) => {
  return request({
    url: `/equipment-borrows/${id}`,
    method: 'put',
    data: { status: 'returned', ...data },
  })
}
