import { Layout, Menu } from 'antd'
import { footerMenu, socialMenu } from 'utils/SignInUpData'
const { Footer } = Layout

const AntdFooter = () => {
  return (
    <Footer>
      <Menu mode="horizontal" items={footerMenu} />
      <Menu mode="horizontal" className="menu-nav-social" items={socialMenu} />
      <p className="copyright">
        Copyright © 2024 by
        <a target="blank" href="https://bootcoop.com.ar/">
          Boot Coop
        </a>
      </p>
    </Footer>
  )
}
export default AntdFooter
