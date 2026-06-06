import request from '@/utils/request'

export const getAudioMaterialList = (params) => {
  return request({
    url: '/audio-materials',
    method: 'get',
    params,
  })
}

export const getAudioMaterialDetail = (id) => {
  return request({
    url: `/audio-materials/${id}`,
    method: 'get',
  })
}

export const createAudioMaterial = (data) => {
  return request({
    url: '/audio-materials',
    method: 'post',
    data,
  })
}

export const updateAudioMaterial = (id, data) => {
  return request({
    url: `/audio-materials/${id}`,
    method: 'put',
    data,
  })
}

export const deleteAudioMaterial = (id) => {
  return request({
    url: `/audio-materials/${id}`,
    method: 'delete',
  })
}

export const uploadAudio = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/audio-materials/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
}

export const getAudioCategories = () => {
  return request({
    url: '/columns',
    method: 'get',
  })
}

export const getAudioList = (params) => {
  return getAudioMaterialList(params)
}

export const getAudioDetail = (id) => {
  return getAudioMaterialDetail(id)
}

export const createAudio = (data) => {
  return createAudioMaterial(data)
}

export const updateAudio = (id, data) => {
  return updateAudioMaterial(id, data)
}

export const deleteAudio = (id) => {
  return deleteAudioMaterial(id)
}
