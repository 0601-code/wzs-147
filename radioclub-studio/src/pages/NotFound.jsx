import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFound = ({ code = '404', title = '404', subTitle = '抱歉，您访问的页面不存在' }) => {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status={code}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFound
