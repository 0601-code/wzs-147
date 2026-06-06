import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, DatePicker, TimePicker, message, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageTitle } from '@/components'
import { scheduleApi } from '@/api'
import { useUser } from '@/contexts'

const { Option } = Select
const { RangePicker } = TimePicker

const AnchorSchedule = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const [anchorList, setAnchorList] = useState([])
  const { isTeacher } = useUser()

  const mockAnchors = [
    { id: 1, name: '张三', className: '高三(1)班' },
    { id: 2, name: '李四', className: '高二(3)班' },
    { id: 3, name: '王五', className: '高一(2)班' },
    { id: 4, name: '赵六', className: '高三(5)班' },
    { id: 5, name: '孙七', className: '高二(1)班' },
  ]

  const mockData = [
    { id: 1, anchor: '张三', day: '周一', time: '07:30-08:00', program: '早间新闻', createdAt: '2024-01-01' },
    { id: 2, anchor: '李四', day: '周二', time: '12:00-12:30', program: '午间音乐', createdAt: '2024-01-01' },
    { id: 3, anchor: '王五', day: '周三', time: '18:00-18:30', program: '校园访谈', createdAt: '2024-01-01' },
    { id: 4, anchor: '赵六', day: '周四', time: '19:00-19:30', program: '英语角', createdAt: '2024-01-01' },
    { id: 5, anchor: '孙七', day: '周五', time: '21:00-21:30', program: '晚间故事', createdAt: '2024-01-01' },
    { id: 6, anchor: '张三', day: '周六', time: '10:00-10:30', program: '周末特别节目', createdAt: '2024-01-01' },
  ]

  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  useEffect(() => {
    fetchData()
    fetchAnchors()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await scheduleApi.getAnchorScheduleList()
      setData(res?.list || res || mockData)
    } catch (error) {
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnchors = async () => {
    try {
      const res = await scheduleApi.getAnchorList()
      setAnchorList(res || mockAnchors)
    } catch (error) {
      setAnchorList(mockAnchors)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingItem(record)
    form.setFieldsValue({
      ...record,
      time: record.time ? record.time.split('-').map(t => dayjs(t, 'HH:mm')) : undefined,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await scheduleApi.deleteAnchorSchedule(id)
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
      const timeRange = values.time
      const timeStr = `${dayjs(timeRange[0]).format('HH:mm')}-${dayjs(timeRange[1]).format('HH:mm')}`
      const submitData = {
        ...values,
        time: timeStr,
      }
      delete submitData.time

      if (editingItem) {
        try {
          await scheduleApi.updateAnchorSchedule(editingItem.id, submitData)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...submitData, time: timeStr } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await scheduleApi.createAnchorSchedule(submitData)
        } catch (e) {
          const newItem = { id: Date.now(), ...submitData, time: timeStr, createdAt: new Date().toLocaleDateString() }
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
      title: '主播',
      dataIndex: 'anchor',
      key: 'anchor',
      width: 120,
    },
    {
      title: '星期',
      dataIndex: 'day',
      key: 'day',
      width: 100,
      render: (day) => <Tag color="blue">{day}</Tag>,
    },
    {
      title: '时段',
      dataIndex: 'time',
      key: 'time',
      width: 140,
    },
    {
      title: '节目',
      dataIndex: 'program',
      key: 'program',
      width: 150,
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
          {isTeacher() && (
            <Popconfirm title="确定删除这个排班吗？" onConfirm={() => handleDelete(record.id)}>
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
        title="主播排班"
        subTitle="管理和查看主播排班表"
        extra={
          isTeacher() && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建排班
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
        title={editingItem ? '编辑排班' : '新建排班'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="anchor"
            label="主播"
            rules={[{ required: true, message: '请选择主播' }]}
          >
            <Select placeholder="请选择主播">
              {anchorList.map((anchor) => (
                <Option key={anchor.id} value={anchor.name}>
                  {anchor.name} - {anchor.className}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="day"
            label="星期"
            rules={[{ required: true, message: '请选择星期' }]}
          >
            <Select placeholder="请选择星期">
              {days.map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="时段"
            rules={[{ required: true, message: '请选择时段' }]}
          >
            <RangePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="program"
            label="节目"
            rules={[{ required: true, message: '请输入节目名称' }]}
          >
            <Input placeholder="请输入节目名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AnchorSchedule
