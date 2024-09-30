import { Button, Col, Form, Input, Layout, Row, Typography } from 'antd'
import { Footer } from 'components/Layout'
import JSEncrypt from 'jsencrypt'
import forge from 'node-forge'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import signinbg from '../assets/images/img-signin.png'

const { Content } = Layout
const { Title } = Typography

const SignIn = ({ setAuthenticated }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Función para cargar la clave pública desde el archivo .crt
  const loadPublicKey = async () => {
    try {
      const response = await fetch('/public.crt')
      if (!response.ok) {
        throw new Error(
          'Error al cargar la clave pública: ' + response.statusText
        )
      }
      const keyText = await response.text()
      // Convertir directamente desde PEM a PublicKey
      const publicKey = forge.pki.publicKeyFromPem(keyText)
      return publicKey
    } catch (error) {
      console.error('Error al cargar la clave pública:', error)
      throw new Error('Error al cargar la clave pública')
    }
  }

  // Función para convertir a base64 en el navegador
  const toBase64 = (str) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    let binary = ''
    const len = data.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i])
    }
    return window.btoa(binary)
  }

  const handleSignIn = async () => {
    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxlfy+juJwTDtw8XolfSK
    QB+JaKTgZMl+MjWo+m9n8Kt64ygqtfGvDda1UvT3t9e2ZpOvlsmfSIN0SUMhsq+T
    /O8+Xyr87/sUU7tYocQ6adGh+zO58EecuSUtgutDdwh9/WkVqHhdCjeZXN5310/s
    afaxJJzBemMjvmc/1yiMtBSVrCl71CloR6J1lnz+QZK+zqaNlKIQdQay9PoQlGEL
    RrGgqo8fHdK3OQVUd6Ifzh5G1Mmnv67esCAKyeW8yeb6lQ7dtsJQJEC8M9yn4n1D
    bz0+OwWWTzqHBo8b5JYi6xXnb/0WsaRX/ooWk5BEykmkkBhSmDYx0ZtLZcA2/Pj2
    jwIDAQAB
    -----END PUBLIC KEY-----`

      // Crear una instancia de JSEncrypt
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)

      // Concatenar username y password
      const credentials = `${username}:${password}`

      // Cifrar las credenciales con la clave pública
      const encryptedCredentials = encrypt.encrypt(credentials)

      // Convertir a base64 para enviar en el header
      const encryptedBase64 = `Basic ${encryptedCredentials}`

      // Enviar la solicitud GET al backend
      const response = await fetch(
        `https://api.abm.camarco.org.ar/api/authentication/login`,
        {
          method: 'GET',
          headers: {
            Authorization: encryptedBase64,
            'Content-Type': 'text/plain',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Guardar el token recibido en localStorage
        localStorage.setItem('token', encryptedBase64)
        setAuthenticated(true)
        navigate('/tables')
      } else {
        setError('Credenciales incorrectas')
      }
    } catch (err) {
      console.error('Error en el proceso de inicio de sesión:', err)
      setError('Ocurrió un error durante el inicio de sesión')
    }
  }

  return (
    <>
      <div className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-evenly">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
              className="signin-align"
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                onFinish={handleSignIn}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  label="Email"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ]}
                >
                  <Input
                    className="input-camarco"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password
                    className="input-camarco"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <div className="align-button">
                  <Button
                    type="primary"
                    className="btn-camarco"
                    danger
                    htmlType="submit"
                  >
                    SIGN IN
                  </Button>
                </div>
                {error && <p>{error}</p>}
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 9 }}
              md={{ span: 12 }}
            >
              <img src={signinbg} alt="" />
            </Col>
          </Row>
        </Content>
        <Footer className="footer-signin" />
      </div>
    </>
  )
}

export default SignIn
