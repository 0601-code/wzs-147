import request from '@/utils/request'

export const getManuscriptList = (params) => {
  return request({
    url: '/manuscripts',
    method: 'get',
    params,
  })
}

export const getManuscriptDetail = (id) => {
  return request({
    url: `/manuscripts/${id}`,
    method: 'get',
  })
}

export const createManuscript = (data) => {
  return request({
    url: '/manuscripts',
    method: 'post',
    data,
  })
}

export const updateManuscript = (id, data) => {
  return request({
    url: `/manuscripts/${id}`,
    method: 'put',
    data,
  })
}

export const deleteManuscript = (id) => {
  return request({
    url: `/manuscripts/${id}`,
    method: 'delete',
  })
}

export const submitManuscript = (id) => {
  return request({
    url: `/manuscripts/${id}/submit`,
    method: 'post',
  })
}

export const approveManuscript = (id, data) => {
  return request({
    url: `/manuscripts/${id}/approve`,
    method: 'post',
    data,
  })
}

export const rejectManuscript = (id, data) => {
  return request({
    url: `/manuscripts/${id}/reject`,
    method: 'post',
    data,
  })
}

export const getArticleList = (params) => {
  return getManuscriptList(params)
}

export const getArticleDetail = (id) => {
  return getManuscriptDetail(id)
}

export const createArticle = (data) => {
  return createManuscript(data)
}

export const updateArticle = (id, data) => {
  return updateManuscript(id, data)
}

export const deleteArticle = (id) => {
  return deleteManuscript(id)
}

export const submitArticle = (id) => {
  return submitManuscript(id)
}

export const approveArticle = (id, data) => {
  return approveManuscript(id, data)
}

export const rejectArticle = (id, data) => {
  return rejectManuscript(id, data)
}
