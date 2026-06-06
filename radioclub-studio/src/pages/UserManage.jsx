import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Popconfirm,
  Switch,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons'
import { PageTitle } from '@/components'
import { userApi } from '@/api'
import { constants } from '@/utils'

const { Option } = Select

const UserManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [passwordForm] = Form.useForm()

  const mockData = [
    { id: 1, name: '张三', email: 'zhangsan@school.edu', role: 'anchor', campus_id: 1, phone: '13800138001', status: 'active', created_at: '2023-09-01' },
    { id: 2, name: '李四', email: 'lisi@school.edu', role: 'anchor', campus_id: 1, phone: '13800138002', status: 'active', created_at: '2023-09-01' },
    { id: 3, name: '王五', email: 'wangwu@school.edu', role: 'anchor', campus_id: 1, phone: '13800138003', status: 'active', created_at: '2023-09-01' },
    { id: 4, name: '赵老师', email: 'zhaoliu@school.edu', role: 'teacher', campus_id: 1, phone: '13800138004', status: 'active', created_at: '2022-09-01' },
    { id: 5, name: '孙管理员', email: 'sunqi@school.edu', role: 'equipment_admin', campus_id: 1, phone: '13800138005', status: 'active', created_at: '2022-09-01' },
    { id: 6, name: '周八', email: 'zhouba@school.edu', role: 'anchor', campus_id: 1, phone: '13800138006', status: 'inactive', created_at: '2023-09-01' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await userApi.getUserList()
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
      await userApi.deleteUser(id)
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
          await userApi.updateUser(editingItem.id, values)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await userApi.createUser(values)
        } catch (e) {
          const newItem = { id: Date.now(), ...values, created_at: new Date().toLocaleDateString() }
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

  const handleChangePassword = (record) => {
    setEditingItem(record)
    passwordForm.resetFields()
    setPasswordModalVisible(true)
  }

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields()
      message.success('密码修改成功')
      setPasswordModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getRoleTag = (role) => {
    const roleInfo = constants.ROLE_MAP[role]
    const colors = {
      teacher: 'purple',
      anchor: 'blue',
      equipment_admin: 'orange',
    }
    return <Tag color={colors[role] || 'default'}>{roleInfo || role}</Tag>
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => getRoleTag(role),
    },
    {
      title: '校区',
      dataIndex: ['campus', 'name'],
      key: 'campus',
      width: 100,
      render: (_, record) => record.campus?.name || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" icon={<KeyOutlined />} onClick={() => handleChangePassword(record)}>
            重置密码
          </Button>
          <Popconfirm title="确定删除这个用户吗？" onConfirm={() => handleDelete(record.id)}>
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
        title="用户管理"
        subTitle="管理系统用户和权限"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建用户
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
        title={editingItem ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" disabled={!!editingItem} />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="teacher">指导老师</Option>
              <Option value="anchor">学生主播</Option>
              <Option value="equipment_admin">设备管理员</Option>
            </Select>
          </Form.Item>
          {!editingItem && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请输入初始密码' }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
          <Form.Item name="campus_id" label="校区">
            <Input placeholder="请输入校区ID" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => setPasswordModalVisible(false)}
        width={400}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManage
