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
  InputNumber,
  Tabs,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons'
import { PageTitle } from '@/components'
import { articleApi } from '@/api'
import { useUser } from '@/contexts'
import { constants } from '@/utils'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const ArticleManage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [reviewForm] = Form.useForm()
  const { isTeacher, isStudent } = useUser()
  const [activeTab, setActiveTab] = useState('all')

  const mockData = [
    { id: 1, title: '校园春季运动会顺利举办', content: '本次运动会共有500名学生参加...', author: '张三', status: 'approved', column: '新闻', createdAt: '2024-01-10 10:00' },
    { id: 2, title: '新学期学生会招新活动', content: '学生会各部门开始招收新成员...', author: '李四', status: 'submitted', column: '通知', createdAt: '2024-01-12 14:30' },
    { id: 3, title: '图书馆新书推荐', content: '本月图书馆新增了一批优秀图书...', author: '王五', status: 'draft', column: '文化', createdAt: '2024-01-13 09:00' },
    { id: 4, title: '英语演讲比赛通知', content: '年度英语演讲比赛即将开始报名...', author: '赵六', status: 'approved', column: '通知', createdAt: '2024-01-14 16:00' },
    { id: 5, title: '校园美食节活动回顾', content: '上周的美食节活动取得了圆满成功...', author: '孙七', status: 'rejected', column: '活动', createdAt: '2024-01-15 11:00' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await articleApi.getArticleList()
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
      await articleApi.deleteArticle(id)
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
          await articleApi.updateArticle(editingItem.id, values)
        } catch (e) {
          setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        }
        message.success('更新成功')
      } else {
        try {
          await articleApi.createArticle(values)
        } catch (e) {
          const newItem = { id: Date.now(), ...values, status: 'draft', createdAt: new Date().toLocaleString() }
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

  const handleSubmitReview = async (id) => {
    try {
      await articleApi.submitArticle(id)
      message.success('提交审核成功')
      fetchData()
    } catch (error) {
      setData(data.map((item) => (item.id === id ? { ...item, status: 'submitted' } : item)))
      message.success('提交审核成功')
    }
  }

  const handleApprove = (record) => {
    setEditingItem(record)
    reviewForm.resetFields()
    setReviewModalVisible(true)
  }

  const handleApproveSubmit = async () => {
    try {
      const values = await reviewForm.validateFields()
      try {
        await articleApi.approveArticle(editingItem.id, values)
      } catch (e) {
        setData(data.map((item) => (item.id === editingItem.id ? { ...item, status: 'approved' } : item)))
      }
      message.success('审核通过')
      setReviewModalVisible(false)
      fetchData()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleReject = (record) => {
    Modal.confirm({
      title: '驳回稿件',
      content: (
        <Form>
          <Form.Item name="feedback" label="驳回原因">
            <TextArea rows={3} placeholder="请输入驳回原因" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        try {
          await articleApi.rejectArticle(record.id, { feedback: '不符合要求' })
        } catch (e) {
          setData(data.map((item) => (item.id === record.id ? { ...item, status: 'rejected' } : item)))
        }
        message.success('已驳回')
        fetchData()
      },
    })
  }

  const getStatusTag = (status) => {
    const statusInfo = constants.MANUSCRIPT_STATUS_MAP[status]
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
      title: '栏目',
      dataIndex: ['column', 'name'],
      key: 'column',
      width: 120,
      render: (_, record) => record.column?.name || record.column || '-',
    },
    {
      title: '作者',
      dataIndex: ['author', 'name'],
      key: 'author',
      width: 100,
      render: (_, record) => record.author?.name || record.author || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'submit_time',
      key: 'submit_time',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'draft' && isStudent() && (
            <Button type="link" icon={<SendOutlined />} onClick={() => handleSubmitReview(record.id)}>
              提交审核
            </Button>
          )}
          {record.status === 'submitted' && isTeacher() && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="link" danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>
                驳回
              </Button>
            </>
          )}
          <Popconfirm title="确定删除这篇稿件吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const filteredData = activeTab === 'all' ? data : data.filter((item) => item.status === activeTab)

  return (
    <div>
      <PageTitle
        title="稿件管理"
        subTitle="管理和审核广播站稿件"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建稿件
          </Button>
        }
      />

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部" key="all" />
          <TabPane tab="草稿" key="draft" />
          <TabPane tab="已提交" key="submitted" />
          <TabPane tab="已通过" key="approved" />
          <TabPane tab="已驳回" key="rejected" />
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
        title={editingItem ? '编辑稿件' : '新建稿件'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入稿件标题" />
          </Form.Item>
          <Form.Item
            name="column_id"
            label="栏目"
            rules={[{ required: true, message: '请选择栏目' }]}
          >
            <Select placeholder="请选择栏目">
              <Option value="新闻">新闻</Option>
              <Option value="通知">通知</Option>
              <Option value="文化">文化</Option>
              <Option value="活动">活动</Option>
              <Option value="故事">故事</Option>
              <Option value="散文">散文</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={8} placeholder="请输入稿件内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="审核通过"
        open={reviewModalVisible}
        onOk={handleApproveSubmit}
        onCancel={() => setReviewModalVisible(false)}
        destroyOnClose
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="feedback" label="审核意见">
            <TextArea rows={3} placeholder="请输入审核意见（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ArticleManage
