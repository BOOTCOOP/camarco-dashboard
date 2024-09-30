import { Button, Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { items } from 'utils/SignInUpData'
const { Header } = Layout

const AntdHeader = ({ btn, authenticated }) => {
  return (
    <Header>
      <div className="header-col header-brand">
        {authenticated && (
          <Link to="/dashboard">
            <h5>Ant DashBoard</h5>
          </Link>
        )}
      </div>
      <div className="header-col header-nav">
        <Menu
          defaultSelectedKeys={['1']}
          mode="horizontal"
          items={items}
          style={{
            display: 'flex',
            width: '40%',
            justifyContent: 'space-between',
            margin: '0 auto',
            alignItems: 'center',
          }}
        />
      </div>
      <div className="header-col header-btn">
        <Button type={btn}>Download</Button>
      </div>
    </Header>
  )
}

export default AntdHeader
