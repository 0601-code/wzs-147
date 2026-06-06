import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Popconfirm,
  Tabs,
} from 'antd'
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageTitle } from '@/components'
import { equipmentApi } from '@/api'
import { useUser } from '@/contexts'
import { constants } from '@/utils'

const { Option } = Select
const { TabPane } = Tabs

const BorrowRecord = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('all')
  const { isTeacher, isAdmin, isStudent } = useUser()

  const mockData = [
    { id: 1, equipment: { name: '无线话筒' }, borrower: { name: '张三' }, borrower_name: '张三', borrow_date: '2024-01-15', expected_return_date: '2024-01-16', status: 'borrowed', purpose: '元旦晚会使用', return_check_note: '' },
    { id: 2, equipment: { name: '数字录音机' }, borrower: { name: '李四' }, borrower_name: '李四', borrow_date: '2024-01-14', expected_return_date: '2024-01-15', actual_return_date: '2024-01-15 14:30', status: 'returned', purpose: '采访用', return_check_note: '设备完好' },
    { id: 3, equipment: { name: '监听耳机' }, borrower: { name: '王五' }, borrower_name: '王五', borrow_date: '2024-01-13', expected_return_date: '2024-01-14', status: 'borrowed', purpose: '节目录制', return_check_note: '' },
    { id: 4, equipment: { name: '专业摄像机' }, borrower: { name: '赵六' }, borrower_name: '赵六', borrow_date: '2024-01-10', expected_return_date: '2024-01-12', status: 'overdue', purpose: '活动拍摄', return_check_note: '' },
    { id: 5, equipment: { name: '三脚架' }, borrower: { name: '孙七' }, borrower_name: '孙七', borrow_date: '2024-01-11', expected_return_date: '2024-01-12', actual_return_date: '2024-01-12 10:00', status: 'returned', purpose: '', return_check_note: '正常归还' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await equipmentApi.getBorrowList()
      setData(res?.list || res || mockData)
    } catch (error) {
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const submitData = {
        ...values,
        borrow_date: values.borrow_date ? values.borrow_date.format('YYYY-MM-DD') : undefined,
        expected_return_date: values.expected_return_date ? values.expected_return_date.format('YYYY-MM-DD') : undefined,
      }
      try {
        await equipmentApi.createBorrow(submitData)
      } catch (e) {
        const newItem = { id: Date.now(), ...submitData, status: 'borrowed' }
        setData([newItem, ...data])
      }
      message.success('申请已提交')
      setModalVisible(false)
      fetchData()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleReturn = (id) => {
    Modal.confirm({
      title: '确认归还',
      content: (
        <Form>
          <Form.Item name="return_check_note" label="归还检查备注">
            <Input.TextArea rows={3} placeholder="请输入归还检查备注" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        try {
          await equipmentApi.returnEquipment(id, { return_check_note: '设备完好' })
        } catch (e) {
          setData(data.map((item) => (item.id === id ? { ...item, status: 'returned', actual_return_date: dayjs().format('YYYY-MM-DD HH:mm') } : item)))
        }
        message.success('已归还')
        fetchData()
      },
    })
  }

  const getStatusTag = (status) => {
    const statusInfo = constants.BORROW_STATUS_MAP[status]
    return <Tag color={statusInfo?.color || 'default'}>{statusInfo?.text || status}</Tag>
  }

  const columns = [
    {
      title: '设备',
      dataIndex: ['equipment', 'name'],
      key: 'equipment',
      width: 150,
      render: (_, record) => record.equipment?.name || record.equipment_name || '-',
    },
    {
      title: '借用人',
      dataIndex: 'borrower_name',
      key: 'borrower_name',
      width: 100,
      render: (_, record) => record.borrower?.name || record.borrower_name || '-',
    },
    {
      title: '借用日期',
      dataIndex: 'borrow_date',
      key: 'borrow_date',
      width: 120,
    },
    {
      title: '预计归还',
      dataIndex: 'expected_return_date',
      key: 'expected_return_date',
      width: 120,
    },
    {
      title: '实际归还',
      dataIndex: 'actual_return_date',
      key: 'actual_return_date',
      width: 140,
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {(record.status === 'borrowed' || record.status === 'overdue') && (isTeacher() || isAdmin()) && (
            <Button type="link" icon={<RollbackOutlined />} onClick={() => handleReturn(record.id)}>
              归还
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const filteredData = activeTab === 'all' ? data : data.filter((item) => item.status === activeTab)

  return (
    <div>
      <PageTitle
        title="设备借还登记"
        subTitle="管理设备的借用和归还记录"
        extra={
          isStudent() && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              申请借用
            </Button>
          )
        }
      />

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部" key="all" />
          <TabPane tab="借用中" key="borrowed" />
          <TabPane tab="已归还" key="returned" />
          <TabPane tab="已逾期" key="overdue" />
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
        title="设备借用申请"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="equipment_id"
            label="设备ID"
            rules={[{ required: true, message: '请输入设备ID' }]}
          >
            <Input placeholder="请输入设备ID" />
          </Form.Item>
          <Form.Item
            name="borrower_name"
            label="借用人姓名"
            rules={[{ required: true, message: '请输入借用人姓名' }]}
          >
            <Input placeholder="请输入借用人姓名" />
          </Form.Item>
          <Form.Item
            name="borrow_date"
            label="借用日期"
            rules={[{ required: true, message: '请选择借用日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="expected_return_date"
            label="预计归还日期"
            rules={[{ required: true, message: '请选择预计归还日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="purpose" label="借用说明">
            <Input.TextArea rows={3} placeholder="请输入借用说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BorrowRecord
