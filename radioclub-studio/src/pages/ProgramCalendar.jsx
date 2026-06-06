import { useState, useEffect } from 'react'
import { Calendar, Badge, Card, Modal, List, Tag, Button, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageTitle } from '@/components'
import { programApi } from '@/api'

const ProgramCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [dayEvents, setDayEvents] = useState([])
  const [calendarData, setCalendarData] = useState({})

  const mockCalendarData = {
    '2024-01-15': [
      { id: 1, name: '早间新闻', time: '07:30', type: 'morning', anchor: '张三' },
      { id: 2, name: '午间音乐', time: '12:00', type: 'afternoon', anchor: '李四' },
      { id: 3, name: '校园访谈', time: '18:00', type: 'evening', anchor: '王五' },
    ],
    '2024-01-16': [
      { id: 4, name: '早间新闻', time: '07:30', type: 'morning', anchor: '赵六' },
      { id: 5, name: '午间音乐', time: '12:00', type: 'afternoon', anchor: '孙七' },
      { id: 6, name: '英语角', time: '19:00', type: 'evening', anchor: '周八' },
    ],
    '2024-01-17': [
      { id: 7, name: '早间新闻', time: '07:30', type: 'morning', anchor: '张三' },
      { id: 8, name: '体育播报', time: '17:30', type: 'afternoon', anchor: '李四' },
      { id: 9, name: '晚间故事', time: '21:00', type: 'evening', anchor: '王五' },
    ],
  }

  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
    try {
      const res = await programApi.getCalendarData()
      if (res) {
        setCalendarData(res)
      }
    } catch (error) {
      setCalendarData(mockCalendarData)
    }
  }

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD')
    return calendarData[dateStr] || []
  }

  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.slice(0, 2).map((item) => (
          <li key={item.id}>
            <Badge
              status={item.type === 'morning' ? 'blue' : item.type === 'afternoon' ? 'success' : 'pink'}
              text={item.name}
            />
          </li>
        ))}
        {listData.length > 2 && (
          <li>
            <Tag color="default">+{listData.length - 2} 更多</Tag>
          </li>
        )}
      </ul>
    )
  }

  const getMonthData = (value) => {
    if (value.month() === 11) {
      return 1394
    }
  }

  const monthCellRender = (value) => {
    const num = getMonthData(value)
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>本月播出</span>
      </div>
    ) : null
  }

  const onSelect = (value) => {
    setSelectedDate(value)
    const listData = getListData(value)
    setDayEvents(listData)
    setModalVisible(true)
  }

  return (
    <div>
      <PageTitle title="节目编排日历" subTitle="查看和管理每日节目安排" />

      <Card>
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          onSelect={onSelect}
        />
      </Card>

      <Modal
        title={`${selectedDate?.format('YYYY年MM月DD日')} 节目安排`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={500}
      >
        {dayEvents.length > 0 ? (
          <List
            dataSource={dayEvents}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<ClockCircleOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                  title={
                    <Space>
                      <span>{item.name}</span>
                      <Tag color={item.type === 'morning' ? 'blue' : item.type === 'afternoon' ? 'green' : 'pink'}>
                        {item.time}
                      </Tag>
                    </Space>
                  }
                  description={`主播：${item.anchor}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>
            当天暂无节目安排
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ProgramCalendar
