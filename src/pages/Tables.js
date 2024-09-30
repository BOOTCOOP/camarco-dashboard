import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  message,
} from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Para redirigir

export default function Tables() {
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [userPagination, setUserPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: false,
  })
  const [selectedUserId, setSelectedUserId] = useState(null) // Estado para guardar el usesysid
  const [initialValues, setInitialValues] = useState({}) // Almacenar valores originales
  const navigate = useNavigate() // Para redirigir después de la edición

  useEffect(() => {
    if (userPagination.total === 0) {
      setUserPagination((prev) => ({ ...prev, total: 1440 })) // Establecer un total alto solo si el total es inicialmente 0
    }
  }, []) // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    fetchData()
  }, [userPagination.current])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = process.env.REACT_APP_TOKEN
      const authorizationHeader = `Basic ${token}`
      const response = await axios.get(
        `https://api.abm.camarco.org.ar/api/authentication/user?page=${userPagination.current}&name=`,
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      )
      const users = response.data?.data?.page?.users || []
      setUserData(users)
      setLoading(false)
      setUserPagination((prev) => ({
        ...prev,
        total: response.data?.data?.search_info?.items || 0,
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
      setLoading(false)
    }
  }

  const handleEdit = async (record) => {
    try {
      const token = process.env.REACT_APP_TOKEN
      const authorizationHeader = `Basic ${token}`

      // Solicitar los detalles completos del usuario por su ID
      const response = await axios.get(
        `https://api.abm.camarco.org.ar/api/authentication/user/${record.usesysid}`,
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      )

      const userData = response.data.data

      // Guardamos el usesysid en el estado y los valores originales en "initialValues"
      setSelectedUserId(userData.usesysid)
      const initialFormValues = {
        surname: userData.surname,
        name: userData.name,
        wrapper: userData.wrapper,
        cuil: userData.data_extension?.cuil || '',
        email: userData.data_extension?.email || '',
      }
      setInitialValues(initialFormValues) // Guardar los valores originales

      // Rellenar el formulario con los datos obtenidos
      form.setFieldsValue(initialFormValues)

      setVisible(true) // Abrir el modal de edición
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const handleDelete = (record) => {
    // Implementa lógica para borrar un usuario
    message.success(`Usuario "${record.username}" borrado correctamente.`)
  }

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = process.env.REACT_APP_TOKEN
        const authorizationHeader = `Basic ${token}`
        const userId = selectedUserId // ID del usuario que guardamos al hacer clic en editar

        // Revisar qué campos fueron modificados comparando con los valores iniciales
        const fieldsToUpdate = {}

        if (values.email !== initialValues.email)
          fieldsToUpdate.email = values.email
        if (values.cuil !== initialValues.cuil)
          fieldsToUpdate.cuil = values.cuil
        if (values.name !== initialValues.name)
          fieldsToUpdate.name = values.name

        // Si no hay campos modificados, no hacer ninguna llamada PATCH
        if (Object.keys(fieldsToUpdate).length === 0) {
          message.warning('No hay cambios para guardar.')
          return
        }

        // Iterar sobre los campos modificados y hacer una solicitud PATCH para cada uno
        for (const [field, value] of Object.entries(fieldsToUpdate)) {
          // Enviar el valor directamente como payload en formato de "application/x-www-form-urlencoded"
          const formData = new URLSearchParams()
          formData.append(field, value)

          const response = await axios.patch(
            `https://api.abm.camarco.org.ar/api/authentication/user/${userId}/${field}`,
            formData, // Enviar los datos como si fuera un formulario
            {
              headers: {
                Authorization: authorizationHeader,
                'Content-Type': 'application/x-www-form-urlencoded', // Formato correcto para enviar datos planos
              },
            }
          )

          if (response.status !== 200) {
            message.error(`Error al editar el campo ${field}.`)
            return
          }
        }

        message.success('Usuario editado correctamente.')
        setVisible(false) // Cerrar el modal después de la edición exitosa
        fetchData() // Refrescar la lista de usuarios
        navigate('/tables') // Redirigir a la página /tables después de editar
      } catch (error) {
        console.error('Error actualizando los datos del usuario:', error)
        message.error('Error al actualizar los datos del usuario.')
      }
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setUserPagination(pagination)
  }

  const handleSearch = async (value) => {
    try {
      const token = process.env.REACT_APP_TOKEN
      const authorizationHeader = `Basic ${token}`
      setLoading(true)
      const response = await axios.get(
        `https://api.abm.camarco.org.ar/api/authentication/user?page=1&name=${value}`,
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      )
      const users = response.data?.data?.page?.users || []
      setUserData(users)
      setUserPagination((prev) => ({
        ...prev,
        current: 1,
        total: response.data?.data?.search_info?.items || 0,
      }))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Cuenta',
      dataIndex: 'surname',
      key: 'surname',
    },
    {
      title: 'Razón social',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Usuario',
      dataIndex: 'wrapper',
      key: 'wrapper',
    },
    {
      title: 'Cuit',
      dataIndex: 'cuil',
      key: 'cuil',
      render: (cuil, record) => cuil || record?.data_extension?.cuil || '--', // Manejo de valor vacío o nulo
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email, record) => email || record?.data_extension?.email || '--', // Manejo de valor vacío o nulo
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" onClick={() => handleDelete(record)}>
            Borrar
          </Button>
        </span>
      ),
    },
  ]

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="User Table"
            >
              <div className="table-responsive">
                <div
                  style={{
                    textAlign: 'center',
                    maxWidth: '80%',
                    margin: '0 auto',
                  }}
                >
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
  )
}
