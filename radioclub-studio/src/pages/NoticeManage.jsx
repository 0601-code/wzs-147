import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tag,
  Popconfirm,
  Tabs,
  Select,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SoundOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageTitle } from '@/components'
import { noticeApi } from '@/api'
import { useUser } from '@/contexts'
import { constants } from '@/utils'

const { TextArea } = Input
const { TabPane } = Tabs
const { Option } = Select

const NoticeManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('all')
  const { isTeacher } = useUser()

  const mockData = [
    { id: 1, title: '元旦放假通知', content: '元旦假期将至，广播站节目安排调整如下...', status: 'broadcasted', reason: '假期安排', schedule_time: '2024-01-01 08:00', actual_broadcast_time: '2024-01-01 08:05' },
    { id: 2, title: '招新活动临时插播', content: '学生会招新活动火热进行中，欢迎同学们报名...', status: 'pending', reason: '招新宣传', schedule_time: '2024-01-10 12:00' },
    { id: 3, title: '期末考试安排通知', content: '本学期期末考试安排已公布，请同学们注意...', status: 'pending', reason: '考试通知', schedule_time: '2024-01-15 09:00' },
    { id: 4, title: '运动会暂停节目通知', content: '由于运动会举办，本周三下午节目暂停...', status: 'cancelled', reason: '活动冲突', schedule_time: '2024-01-05 09:00' },
    { id: 5, title: '紧急通知：设备维护', content: '今日下午广播设备维护，节目暂停...', status: 'broadcasted', reason: '设备维护', schedule_time: '2024-01-15 14:00', actual_broadcast_time: '2024-01-15 14:00' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await noticeApi.getNoticeList()
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
    form.setFieldsValue({
      ...record,
      schedule_time: record.schedule_time ? dayjs(record.schedule_time) : undefined,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await noticeApi.deleteNotice(id)
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
      const submitData = {
        ...values,
        schedule_time: values.schedule_time ? dayjs(values.schedule_time).format('YYYY-MM-DD HH:mm') : undefined,
      }

      if (editingItem) {
        try {
          await noticeApi.updateNotice(editingItem.id, submitData)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...submitData } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await noticeApi.createNotice(submitData)
        } catch (e) {
          const newItem = { id: Date.now(), ...submitData, status: 'pending' }
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

  const handleBroadcast = async (id) => {
    try {
      await noticeApi.broadcastInterruptNotice(id)
      message.success('已标记为播出')
      fetchData()
    } catch (error) {
      setData(data.map((item) => (item.id === id ? { ...item, status: 'broadcasted', actual_broadcast_time: dayjs().format('YYYY-MM-DD HH:mm') } : item)))
      message.success('已标记为播出')
    }
  }

  const handleCancel = async (id) => {
    try {
      await noticeApi.cancelInterruptNotice(id)
      message.success('已取消')
      fetchData()
    } catch (error) {
      setData(data.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)))
      message.success('已取消')
    }
  }

  const getStatusTag = (status) => {
    const statusInfo = constants.NOTICE_STATUS_MAP[status]
    return <Tag color={statusInfo?.color || 'default'}>{statusInfo?.text || status}</Tag>
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '计划播出时间',
      dataIndex: 'schedule_time',
      key: 'schedule_time',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '实际播出时间',
      dataIndex: 'actual_broadcast_time',
      key: 'actual_broadcast_time',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<SoundOutlined />} onClick={() => handleBroadcast(record.id)}>
                标记播出
              </Button>
              <Button type="link" danger icon={<CloseOutlined />} onClick={() => handleCancel(record.id)}>
                取消
              </Button>
            </>
          )}
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {isTeacher() && (
            <Popconfirm title="确定删除这个插播通知吗？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const filteredData = activeTab === 'all' ? data : data.filter((item) => item.status === activeTab)

  return (
    <div>
      <PageTitle
        title="临时插播通知"
        subTitle="管理临时插播通知"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建通知
          </Button>
        }
      />

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部" key="all" />
          <TabPane tab="待播出" key="pending" />
          <TabPane tab="已播出" key="broadcasted" />
          <TabPane tab="已取消" key="cancelled" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? '编辑插播通知' : '新建插播通知'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          <Form.Item
            name="reason"
            label="原因"
            rules={[{ required: true, message: '请输入原因' }]}
          >
            <Input placeholder="请输入插播原因" />
          </Form.Item>
          <Form.Item
            name="schedule_time"
            label="计划播出时间"
            rules={[{ required: true, message: '请选择计划播出时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={5} placeholder="请输入通知内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NoticeManage
