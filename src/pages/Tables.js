import React, { useState, useEffect } from "react";
import { Row, Col, Card, Radio, Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

export default function Tables() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [userPagination, setUserPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
  });

  useEffect(() => {
    if (userPagination.total === 0) {
      setUserPagination((prev) => ({ ...prev, total: 1440 })); // Establecer un total alto solo si el total es inicialmente 0
    }
  }, []); // Solo se ejecuta una vez al montar el componente
  
  useEffect(() => {
    fetchData();
  }, [userPagination.current]); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.abm.camarco.org.ar/api/authentication/user?page=${userPagination.current}&name=`,
        {
          headers: {
            Authorization: `${token}`, 
          },
        }
      );
      const users = response.data?.data?.page?.users || [];      
      setUserData(users);
      setLoading(false);
      setUserPagination((prev) => ({ ...prev, total: response.data?.data?.search_info?.items || 0 }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (record) => {
    // Implementa lógica para borrar un usuario
    message.success(`Usuario "${record.username}" borrado correctamente.`);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Implementa lógica para editar un usuario con los valores de `values`
      console.log("Valores editados:", values);
      setVisible(false);
      message.success(`Usuario editado correctamente.`);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setUserPagination(pagination);
  };

  const handleSearch = async (value) => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(
        `https://api.abm.camarco.org.ar/api/authentication/user?page=1&name=${value}`,
        {
          headers: {
            Authorization: `${token}`, 
          },
        }
      );
      const users = response.data?.data?.page?.users || [];      
      setUserData(users);
      setUserPagination((prev) => ({ ...prev, current: 1, total: response.data?.data?.search_info?.items || 0 }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Cuenta",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Razón social",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Usuario",
      dataIndex: "wrapper",
      key: "wrapper",
    },
    {
      title: "Cuit",
      dataIndex: "cuil",
      key: "cuil",
      render: (cuil, record) => cuil || record?.data_extension?.cuil || "--", // Manejo de valor vacío o nulo
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email, record) => email || record?.data_extension?.email || "--", // Manejo de valor vacío o nulo
    },
    {
      title: "Acciones",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
          <Button type="link" onClick={() => handleDelete(record)}>Borrar</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="User Table"
              // extra={
              //   <Radio.Group>
              //     <Radio.Button>All</Radio.Button>
              //     <Radio.Button>Online</Radio.Button>
              //   </Radio.Group>
              // }
            >
              <div className="table-responsive">
                <div style={{ textAlign: "center", maxWidth: "80%", margin: "0 auto" }}>
                  <Input.Search
                    placeholder="Buscar por nombre"
                    onSearch={handleSearch}
                    style={{ marginBottom: 16 }}
                  />
                </div>
                <Table
                  columns={columns}
                  dataSource={userData}
                  pagination={userPagination}
                  loading={loading}
                  className="ant-border-space"
                  onChange={handleTableChange} // Maneja el cambio de página, filtro y orden
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title="Editar Usuario"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="surname" label="Cuenta">
            <Input disabled />
          </Form.Item>
          <Form.Item name="name" label="Razón social">
            <Input />
          </Form.Item>
          <Form.Item name="wrapper" label="Usuario">
            <Input />
          </Form.Item>
          <Form.Item name="cuil" label="cuil">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}