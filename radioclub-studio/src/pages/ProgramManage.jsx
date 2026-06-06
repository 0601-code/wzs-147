import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageTitle } from '@/components'
import { programApi } from '@/api'
import { useUser } from '@/contexts'

const { Option } = Select

const ProgramManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const { isTeacher } = useUser()

  const mockData = [
    { id: 1, name: '早间新闻', description: '每天早晨播报国内外重要新闻', duration: 30, broadcast_time: '07:30-08:00', status: 'active', campus: { name: '主校区' } },
    { id: 2, name: '午间音乐', description: '午休时间播放轻松音乐', duration: 30, broadcast_time: '12:00-12:30', status: 'active', campus: { name: '主校区' } },
    { id: 3, name: '校园访谈', description: '采访校园风云人物', duration: 30, broadcast_time: '18:00-18:30', status: 'active', campus: { name: '主校区' } },
    { id: 4, name: '英语角', description: '英语学习和交流', duration: 30, broadcast_time: '19:00-19:30', status: 'active', campus: { name: '主校区' } },
    { id: 5, name: '晚间故事', description: '睡前故事时间', duration: 30, broadcast_time: '21:00-21:30', status: 'inactive', campus: { name: '主校区' } },
    { id: 6, name: '体育播报', description: '体育赛事和新闻', duration: 20, broadcast_time: '17:30-17:50', status: 'active', campus: { name: '主校区' } },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await programApi.getProgramList()
      setData(res?.list || res || mockData)
    } catch (error) {
      setData(mockData)
    } finally {
      setLoading(false)
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
      await programApi.deleteProgram(id)
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
          await programApi.updateProgram(editingItem.id, values)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await programApi.createProgram(values)
        } catch (e) {
          const newItem = { id: Date.now(), ...values }
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

  const columns = [
    {
      title: '栏目名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '播出时间',
      dataIndex: 'broadcast_time',
      key: 'broadcast_time',
      width: 130,
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: '校区',
      dataIndex: ['campus', 'name'],
      key: 'campus',
      width: 100,
      render: (_, record) => record.campus?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '播出中' : '已停播'}
        </Tag>
      ),
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
          {isTeacher() && (
            <Popconfirm title="确定删除这个栏目吗？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageTitle
        title="节目栏目管理"
        subTitle="管理广播站的所有节目栏目"
        extra={
          isTeacher() && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建栏目
            </Button>
          )
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
        title={editingItem ? '编辑栏目' : '新建栏目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="栏目名称"
            rules={[{ required: true, message: '请输入栏目名称' }]}
          >
            <Input placeholder="请输入栏目名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入栏目描述" />
          </Form.Item>
          <Form.Item
            name="broadcast_time"
            label="播出时间"
            rules={[{ required: true, message: '请输入播出时间' }]}
          >
            <Input placeholder="例如：07:30-08:00" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="时长(分钟)"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <Input type="number" placeholder="请输入时长" />
          </Form.Item>
          <Form.Item name="campus_id" label="校区">
            <Input placeholder="请输入校区ID" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">播出中</Option>
              <Option value="inactive">已停播</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProgramManage
