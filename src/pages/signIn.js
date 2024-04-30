import React, { useState } from "react";
import { Layout, Button, Typography, Form, Input, Col, Row } from "antd";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { Header, Footer } from "components/Layout";
import signinbg from "../assets/images/img-signin.png";


const { Content } = Layout;
const { Title } = Typography;


const SignIn = ({ setAuthenticated }) => {
  const navigate = useNavigate(); // Obtiene la función de redirección
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (username === process.env.REACT_APP_USERNAME && password === process.env.REACT_APP_PASSWORD) {
      // Guardar el token de autenticación en localStorage
      localStorage.setItem("token", process.env.REACT_APP_TOKEN);
      console.log("se guardo en localstorage");
      // Actualizar el estado de autenticación en App
      setAuthenticated(true);
      // Redirigir al dashboard utilizando la función de redirección
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };


  return (
    <>
      <div className="layout-default layout-signin">
      {/* <Header btn="primary" authenticated={false} /> */}
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
                      message: "Please input your email!",
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
                      message: "Please input your password!",
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
                  <Button type="primary" className="btn-camarco" danger htmlType="submit">
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
        {/* Footer */}
        <Footer className='footer-signin' />
      </div>
    </>
  );
};

export default SignIn;
