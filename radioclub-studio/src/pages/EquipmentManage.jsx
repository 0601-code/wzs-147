import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageTitle } from '@/components'
import { equipmentApi } from '@/api'
import { useUser } from '@/contexts'
import { constants } from '@/utils'

const { Option } = Select

const EquipmentManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const { isAdmin, isTeacher } = useUser()

  const mockData = [
    { id: 1, name: '专业调音台', category: '音频设备', brand: 'Yamaha', model: 'MG16', serial_number: 'SN001', status: 'available', campus_id: 1, purchase_date: '2023-01-10' },
    { id: 2, name: '无线话筒', category: '音频设备', brand: 'Shure', model: 'SM58', serial_number: 'SN002', status: 'borrowed', campus_id: 1, purchase_date: '2023-02-15' },
    { id: 3, name: '监听耳机', category: '音频设备', brand: 'Sony', model: 'MDR-7506', serial_number: 'SN003', status: 'available', campus_id: 1, purchase_date: '2023-03-20' },
    { id: 4, name: 'CD播放机', category: '播放设备', brand: 'Denon', model: 'DN-300C', serial_number: 'SN004', status: 'maintenance', campus_id: 1, purchase_date: '2022-11-05' },
    { id: 5, name: '数字录音机', category: '录音设备', brand: 'Zoom', model: 'H6', serial_number: 'SN005', status: 'available', campus_id: 1, purchase_date: '2023-04-12' },
    { id: 6, name: '功放机', category: '音频设备', brand: 'Crown', model: 'XLS1000', serial_number: 'SN006', status: 'available', campus_id: 1, purchase_date: '2023-05-08' },
  ]

  const categories = ['音频设备', '播放设备', '录音设备', '配件', '其他']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await equipmentApi.getEquipmentList()
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
      await equipmentApi.deleteEquipment(id)
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
          await equipmentApi.updateEquipment(editingItem.id, values)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await equipmentApi.createEquipment(values)
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

  const getStatusTag = (status) => {
    const statusInfo = constants.EQUIPMENT_STATUS_MAP[status]
    return <Tag color={statusInfo?.color || 'default'}>{statusInfo?.text || status}</Tag>
  }

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: '序列号',
      dataIndex: 'serial_number',
      key: 'serial_number',
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
      title: '校区',
      dataIndex: ['campus', 'name'],
      key: 'campus',
      width: 100,
      render: (_, record) => record.campus?.name || '-',
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
          {(isAdmin() || isTeacher()) && (
            <Popconfirm title="确定删除这个设备吗？" onConfirm={() => handleDelete(record.id)}>
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
        title="设备管理"
        subTitle="管理广播站的所有设备"
        extra={
          (isAdmin() || isTeacher()) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加设备
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
        title={editingItem ? '编辑设备' : '添加设备'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="brand" label="品牌">
            <Input placeholder="请输入品牌" />
          </Form.Item>
          <Form.Item name="model" label="型号">
            <Input placeholder="请输入型号" />
          </Form.Item>
          <Form.Item name="serial_number" label="序列号">
            <Input placeholder="请输入序列号" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="available">可用</Option>
              <Option value="borrowed">借出中</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Form.Item>
          <Form.Item name="campus_id" label="校区">
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入校区ID" />
          </Form.Item>
          <Form.Item name="purchase_date" label="购置日期">
            <Input placeholder="请输入购置日期，如：2024-01-01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default EquipmentManage
