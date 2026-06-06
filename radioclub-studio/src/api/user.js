import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export const logout = () => {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export const getUserInfo = () => {
  return request({
    url: '/me',
    method: 'get',
  })
}

export const changePassword = (data) => {
  return request({
    url: '/password',
    method: 'put',
    data,
  })
}

export const getUserList = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params,
  })
}

export const createUser = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data,
  })
}

export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data,
  })
}

export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete',
  })
}
