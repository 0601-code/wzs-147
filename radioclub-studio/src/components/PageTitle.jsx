import { Typography, Space } from 'antd'

const { Title, Text } = Typography

const PageTitle = ({ title, subTitle, extra, children }) => {
  return (
    <div className="page-header">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Space align="baseline" size="middle">
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          {subTitle && <Text type="secondary">{subTitle}</Text>}
        </Space>
        {extra && <div>{extra}</div>}
      </div>
      {children}
    </div>
  )
}

export default PageTitle
