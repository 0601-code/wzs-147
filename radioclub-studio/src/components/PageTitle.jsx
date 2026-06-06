import { PageHeader } from 'antd'

const PageTitle = ({ title, subTitle, extra, children }) => {
  return (
    <div className="page-header">
      <PageHeader
        title={title}
        subTitle={subTitle}
        extra={extra}
      >
        {children}
      </PageHeader>
    </div>
  )
}

export default PageTitle
