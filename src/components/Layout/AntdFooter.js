import { Col, Layout, Row } from 'antd'
import { Iconify } from 'utils/Iconify'
const { Footer } = Layout
export default function AntdFooter() {
  return (
    <Footer style={{ backgroundColor: '#fafafa' }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2024, made with{' '}
            {
              <Iconify
                icon="akar-icons:heart"
                style={{ color: 'red', fill: 'red' }}
              />
            }{' '}
            by
            <a
              href="https://bootcoop.com.ar/"
              className="font-weight-bold"
              target="_blank"
              rel="noreferrer"
            >
              Boot Coop
            </a>
            for a better web.
          </div>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <div className="footer-menu">
            <ul>
              {['Home', 'About Us', 'Portfolio', 'Contact us'].map((item) => (
                <li className="nav-item" key={item}>
                  <a
                    href={`https://bootcoop.com.ar/#${item
                      .toLowerCase()
                      .replace(/\s+/g, '')}`}
                    className="nav-link text-muted"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Footer>
  )
}
