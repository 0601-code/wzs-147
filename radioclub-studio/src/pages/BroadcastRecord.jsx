import { useState, useEffect } from 'react'
import { Table, Button, Space, Card, Tag, Input, Select, DatePicker, message } from 'antd'
import { SearchOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageTitle } from '@/components'
import { broadcastApi } from '@/api'

const { Option } = Select
const { RangePicker } = DatePicker

const BroadcastRecord = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [currentProgram, setCurrentProgram] = useState(null)
  const [startTime, setStartTime] = useState(null)

  const mockData = [
    { id: 1, program: '早间新闻', anchor: '张三', date: '2024-01-15', startTime: '07:30', endTime: '08:00', duration: 30, status: 'completed' },
    { id: 2, program: '午间音乐', anchor: '李四', date: '2024-01-15', startTime: '12:00', endTime: '12:30', duration: 30, status: 'completed' },
    { id: 3, program: '校园访谈', anchor: '王五', date: '2024-01-14', startTime: '18:00', endTime: '18:30', duration: 30, status: 'completed' },
    { id: 4, program: '英语角', anchor: '赵六', date: '2024-01-14', startTime: '19:00', endTime: '19:30', duration: 30, status: 'completed' },
    { id: 5, program: '晚间故事', anchor: '孙七', date: '2024-01-13', startTime: '21:00', endTime: '21:30', duration: 30, status: 'completed' },
    { id: 6, program: '体育播报', anchor: '周八', date: '2024-01-13', startTime: '17:30', endTime: '17:50', duration: 20, status: 'completed' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await broadcastApi.getBroadcastList()
      setData(res?.list || res || mockData)
    } catch (error) {
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleStartBroadcast = () => {
    const now = new Date()
    setIsBroadcasting(true)
    setCurrentProgram('早间新闻')
    setStartTime(now)
    message.success('开始播出')
  }

  const handleEndBroadcast = async () => {
    try {
      await broadcastApi.endBroadcast(1, { endTime: new Date().toISOString() })
    } catch (e) {
      const endTime = new Date()
      const duration = Math.round((endTime - startTime) / 60000)
      const newRecord = {
        id: Date.now(),
        program: currentProgram,
        anchor: '当前用户',
        date: dayjs().format('YYYY-MM-DD'),
        startTime: dayjs(startTime).format('HH:mm'),
        endTime: dayjs(endTime).format('HH:mm'),
        duration,
        status: 'completed',
      }
      setData([newRecord, ...data])
    }
    setIsBroadcasting(false)
    setCurrentProgram(null)
    setStartTime(null)
    message.success('播出结束')
  }

  const columns = [
    {
      title: '节目名称',
      dataIndex: 'program',
      key: 'program',
      width: 150,
    },
    {
      title: '主播',
      dataIndex: 'anchor',
      key: 'anchor',
      width: 100,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 100,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 100,
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? '已完成' : '播出中'}
        </Tag>
      ),
    },
  ]

  return (
    <div>
      <PageTitle
        title="播出记录"
        subTitle="查看和管理播出记录"
        extra={
          !isBroadcasting ? (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleStartBroadcast}>
              开始播出
            </Button>
          ) : (
            <Button danger icon={<StopOutlined />} onClick={handleEndBroadcast}>
              结束播出
            </Button>
          )
        }
      />

      {isBroadcasting && (
        <Card style={{ marginBottom: 16, borderColor: '#52c41a', borderWidth: 2 }}>
          <Space>
            <Tag color="green" style={{ fontSize: 16, padding: '4px 12px' }}>
              正在播出
            </Tag>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>{currentProgram}</span>
            <span style={{ color: '#999' }}>
              开始时间：{dayjs(startTime).format('HH:mm:ss')}
            </span>
          </Space>
        </Card>
      )}

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input
            placeholder="搜索节目名称"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select placeholder="选择节目" style={{ width: 150 }}>
            <Option value="">全部节目</Option>
          </Select>
          <RangePicker />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default BroadcastRecord
