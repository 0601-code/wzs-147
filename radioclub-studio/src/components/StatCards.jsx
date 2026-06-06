import { Card, Statistic, Row, Col } from 'antd'

const StatCards = ({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <Row gutter={16}>
      {data.map((item, index) => (
        <Col span={6} key={index}>
          <Card hoverable>
            <Statistic
              title={item.title}
              value={item.value}
              prefix={item.prefix}
              suffix={item.suffix}
              valueStyle={{ color: item.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatCards
