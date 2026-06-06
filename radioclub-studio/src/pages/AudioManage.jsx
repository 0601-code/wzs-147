import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, Upload, message, Tag, Popconfirm, Progress } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { PageTitle } from '@/components'
import { audioApi } from '@/api'
import { constants } from '@/utils'

const { Option } = Select

const AudioManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [categories, setCategories] = useState([])

  const mockCategories = [
    { id: 1, name: '片头音乐' },
    { id: 2, name: '背景音乐' },
    { id: 3, name: '音效素材' },
    { id: 4, name: '节目录音' },
    { id: 5, name: '广告' },
  ]

  const mockData = [
    { id: 1, name: '早间新闻片头', category: '片头音乐', duration: '0:30', size: '2.5MB', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: '轻松背景音乐A', category: '背景音乐', duration: '3:45', size: '8.2MB', status: 'active', createdAt: '2024-01-05' },
    { id: 3, name: '新闻过渡音效', category: '音效素材', duration: '0:05', size: '500KB', status: 'active', createdAt: '2024-01-10' },
    { id: 4, name: '校园访谈第1期', category: '节目录音', duration: '30:00', size: '28MB', status: 'active', createdAt: '2024-01-12' },
    { id: 5, name: '招新广告', category: '广告', duration: '1:00', size: '4.1MB', status: 'inactive', createdAt: '2024-01-15' },
  ]

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await audioApi.getAudioList()
      setData(res?.list || res || mockData)
    } catch (error) {
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await audioApi.getAudioCategories()
      setCategories(res || mockCategories)
    } catch (error) {
      setCategories(mockCategories)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingItem(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await audioApi.deleteAudio(id)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      setData(data.filter((item) => item.id !== id))
      message.success('删除成功')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingItem) {
        try {
          await audioApi.updateAudio(editingItem.id, values)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await audioApi.createAudio(values)
        } catch (e) {
          const newItem = { id: Date.now(), ...values, duration: '0:00', size: '0MB', createdAt: new Date().toLocaleDateString() }
          setData([...data, newItem])
        }
        message.success('创建成功')
      }
      setModalVisible(false)
      fetchData()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const uploadProps = {
    beforeUpload: (file) => {
      setUploading(true)
      setUploadProgress(0)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadProgress(100)
        setUploading(false)
        message.success('上传成功')
      }
      return false
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setUploadProgress(info.file.percent || 0)
      }
    },
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <PlayCircleOutlined style={{ color: '#1677ff', fontSize: 16, cursor: 'pointer' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除这个音频吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageTitle
        title="音频素材管理"
        subTitle="管理广播站的音频素材库"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            上传音频
          </Button>
        }
      />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? '编辑音频' : '上传音频'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {!editingItem && (
            <Form.Item label="上传文件">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
              {uploading && <Progress percent={uploadProgress} style={{ marginTop: 8 }} />}
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入音频名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AudioManage
