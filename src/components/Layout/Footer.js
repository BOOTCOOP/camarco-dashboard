import { Layout, Menu } from 'antd'
import { socialMenu } from 'utils/SignInUpData'
const { Footer } = Layout

const AntdFooter = () => {
  return (
    <Footer>
      {/* <Menu mode="horizontal" items={footerMenu} /> */}
      <Menu mode="horizontal" className="menu-nav-social">
        {socialMenu.map((item) => (
          <Menu.Item key={item.key} className="menu-item-social">
            {/* Enlace a cada red social */}
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.icon}
            </a>
          </Menu.Item>
        ))}
      </Menu>
      <p className="copyright">
        Copyright © 2024 by
        <a
          target="blank"
          className="bootcoop-text"
          href="https://bootcoop.com.ar/"
        >
          Boot Coop
        </a>
      </p>
    </Footer>
  )
}
export default AntdFooter
