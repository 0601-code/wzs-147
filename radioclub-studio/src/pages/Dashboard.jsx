import { useState, useEffect } from 'react'
import { Row, Col, Card, List, Tag, Empty } from 'antd'
import {
  SoundOutlined,
  FileTextOutlined,
  ToolOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { PageTitle, StatCards } from '@/components'
import { dashboardApi } from '@/api'
import { constants } from '@/utils'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [recentBroadcasts, setRecentBroadcasts] = useState([])
  const [articleStats, setArticleStats] = useState(null)
  const [weeklyChart, setWeeklyChart] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsData, broadcasts, articles, weekly] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getRecentBroadcasts(),
        dashboardApi.getArticleStats(),
        dashboardApi.getWeeklyBroadcastChart(),
      ])

      setStats([
        { title: '本周播出次数', value: statsData?.broadcastCount || 12, suffix: '次', color: '#1677ff' },
        { title: '已提交稿件', value: statsData?.submittedArticles || 5, suffix: '篇', color: '#faad14' },
        { title: '设备总数', value: statsData?.equipmentCount || 28, suffix: '件', color: '#52c41a' },
        { title: '借出中设备', value: statsData?.borrowedEquipment || 3, suffix: '件', color: '#eb2f96' },
      ])

      setRecentBroadcasts(broadcasts || [
        { id: 1, program: '早间新闻', time: '07:30 - 08:00', date: '2024-01-15', anchor: '张三', status: 'completed' },
        { id: 2, program: '午间音乐', time: '12:00 - 12:30', date: '2024-01-15', anchor: '李四', status: 'completed' },
        { id: 3, program: '校园访谈', time: '18:00 - 18:30', date: '2024-01-14', anchor: '王五', status: 'completed' },
        { id: 4, program: '英语角', time: '19:00 - 19:30', date: '2024-01-14', anchor: '赵六', status: 'completed' },
        { id: 5, program: '晚间故事', time: '21:00 - 21:30', date: '2024-01-13', anchor: '孙七', status: 'completed' },
      ])

      setArticleStats(articles || {
        total: 45,
        draft: 8,
        submitted: 5,
        approved: 30,
        rejected: 2,
      })

      setWeeklyChart(weekly || {
        days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        counts: [3, 4, 3, 5, 4, 2, 1],
        durations: [90, 120, 90, 150, 120, 60, 30],
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeeklyChartOption = () => {
    if (!weeklyChart) return {}
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['播出次数', '播出时长(分钟)'],
        top: 0,
      },
      xAxis: {
        type: 'category',
        data: weeklyChart.days,
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '次数',
          axisLabel: {
            formatter: '{value} 次'
          }
        },
        {
          type: 'value',
          name: '时长',
          axisLabel: {
            formatter: '{value} 分'
          }
        }
      ],
      series: [
        {
          name: '播出次数',
          type: 'bar',
          data: weeklyChart.counts,
          itemStyle: {
            color: '#1677ff',
          },
        },
        {
          name: '播出时长(分钟)',
          type: 'line',
          yAxisIndex: 1,
          data: weeklyChart.durations,
          itemStyle: {
            color: '#52c41a',
          },
          smooth: true,
        },
      ],
    }
  }

  const getArticleChartOption = () => {
    if (!articleStats) return {}
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '稿件状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: articleStats.draft, name: '草稿', itemStyle: { color: '#bfbfbf' } },
            { value: articleStats.submitted, name: '已提交', itemStyle: { color: '#faad14' } },
            { value: articleStats.approved, name: '已通过', itemStyle: { color: '#52c41a' } },
            { value: articleStats.rejected, name: '已驳回', itemStyle: { color: '#ff4d4f' } },
          ],
        },
      ],
    }
  }

  return (
    <div>
      <PageTitle title="仪表盘" subTitle="欢迎使用校园广播站管理系统" />

      <StatCards data={stats} />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="本周播出统计" className="dashboard-card">
            <ReactECharts option={getWeeklyChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="稿件统计" className="dashboard-card">
            <ReactECharts option={getArticleChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="最近播出记录">
            {recentBroadcasts.length > 0 ? (
              <List
                dataSource={recentBroadcasts}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Tag color="green" key="status">已完成</Tag>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<SoundOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                      title={item.program}
                      description={
                        <span>
                          <ClockCircleOutlined style={{ marginRight: 8 }} />
                          {item.date} {item.time}
                          <span style={{ marginLeft: 16 }}>主播：{item.anchor}</span>
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无播出记录" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
