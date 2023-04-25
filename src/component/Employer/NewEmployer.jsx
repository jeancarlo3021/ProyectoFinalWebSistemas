import { getUser, insertNewUser } from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect, useRef } from 'react'
import 'react-dropdown/style.css'
import { useAuth } from '../Login/AuthProvider'
import { Formik } from 'formik'
import { Modal } from 'react-bootstrap'
import {
  Select,
  Input,
  FormControl,
  Button,
  FormLabel,
  Stack,
  Box,
  HStack,
  Textarea,
  Heading,
  VStack,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  useToast,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { updateUser, deleteUser } from '../firebase'

export const NewEmployer = () => {
  const [showUser, setshowUser] = useState([])
  const toast = useToast()
  const { signup } = useAuth()
  const [show, setShow] = useState(false)
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    level: '',
  })
  const [level, setlevel] = useState(1)
  const [levelupdate, setlevelupdate] = useState('')

  const handleClose = () => {
    setShow(false)
  }
  const handleShow = (user) => {
    setUser(user)
    setShow(true)
  }

  const options = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
  ]

  const showpro = async () => {
    const res = await getUser()
    setshowUser([...res])
  }
  useEffect(() => {
    showpro()
  }, [])

  const updateUSER = async (update) => {
    const UPUser = {
      name: update.name !== '' ? update.name : user.name,
      email: update.email !== '' ? update.email : user.email,
      password: update.corfimPassword,
      phone: update.phone !== '' ? update.phone : user.phone,
      address: update.address !== '' ? update.address : user.address,
      level: levelupdate !== '' ? levelupdate : user.level,
    }
    await updateUser(user.docId, UPUser)
    toast({
      title: 'Empleado actualizado',
      status: 'success',
      duration: 3000,
      variant: 'subtle',
      position: 'bottom-right',
    })
    handleClose()
    setshowUser([...showUser, UPUser])
    setUser({
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      level: '',
    })
    setlevelupdate('')
  }

  const insertNew = async (user) => {
    if (user.password !== '' && user.email !== '') {
      const newUser = {
        id: uuidv4(),
        email: user.email,
        level: level,
        name: user.name,
        phone: user.phone,
        address: user.address,
      }
      const res = await insertNewUser(newUser)
      newUser.docId = res.id
      toast({
        title: 'Empleado agregado',
        status: 'success',
        duration: 3000,
        variant: 'subtle',
        position: 'bottom-right',
      })
      setUser({
        email: '',
        password: '',
        name: '',
        phone: '',
        address: '',
      })
      setlevel(1)
      setshowUser([...showUser, newUser])
    }
  }

  const D = async (deleted) => {
    await deleteUser(deleted.docId)
    const tmp = showUser.filter((link) => link.docId !== deleted.docId)
    setshowUser([...tmp])
    toast({
      title: ' Empleado eliminado',
      status: 'success',
      duration: 3000,
      variant: 'subtle',
      position: 'bottom-right',
    })
  }

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', corfimPassword: '', name: '', phone: '', address: '' }}
        validate={(values) => {
          const errors = {}
          if (!values.email) {
            errors.email = 'Correo electronico es requerido'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Correo electronico invalido'
          }
          if (!values.password) {
            errors.password = 'La contraseña es requerido'
          }
          if (values.password.length < 6) {
            errors.password = 'La contraseña tiene que tener 6 digitos'
          }
          if (!values.corfimPassword) {
            errors.corfimPassword = 'La contraseña es requerido'
          }
          if (values.corfimPassword.length < 6) {
            errors.corfimPassword = 'La contraseña tiene que tener 6 digitos'
          }
          if (values.password !== values.corfimPassword) {
            console.log(values.corfimPassword, values.password)
            errors.corfimPassword = 'Las contrasenas no coinciden'
          }
          if (!values.name) {
            errors.name = 'nombre completo requerido'
          }
          if (!values.phone) {
            errors.phone = 'Numero de telefono requerido'
          }
          if (!values.address) {
            errors.address = 'Dirreccion requerida'
          }

          return errors
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            await signup(values.email, values.password)
            insertNew(values)
          } catch (error) {
            setError(error.message)
          }
          resetForm({ values: '' })
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Stack mt={5}>
            <Center>
              <Heading>Incluir nuevo empleado</Heading>
            </Center>
            <Stack>
              <FormControl>
                <HStack m={4}>
                  <FormLabel htmlFor='email'>Correo electronico</FormLabel>
                  <Input
                    type='email'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    maxW={300}
                  />
                  <Text color='red'>{errors.email && touched.email && errors.email}</Text>
                </HStack>
                <HStack spacing={5} m={4}>
                  <FormLabel>Password</FormLabel>
                  <VStack>
                    <Input
                      type='password'
                      name='password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      maxW={300}
                    />
                    <Text color='red'>{errors.password && touched.password && errors.password}</Text>
                  </VStack>
                  <FormLabel htmlFor='password'>Vereficar password</FormLabel>
                  <VStack>
                    <Input
                      type='password'
                      name='corfimPassword'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.corfimPassword}
                      maxW={300}
                    />
                    <Text color='red'>{errors.corfimPassword && touched.corfimPassword && errors.corfimPassword}</Text>
                  </VStack>
                </HStack>
                <HStack spacing={6} m={4}>
                  <FormLabel htmlFor='name'>Nombre</FormLabel>
                  <VStack>
                    <Input
                      type='text'
                      name='name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      maxW={300}
                    />
                    <Text color='red'>{errors.name && touched.name && errors.name}</Text>
                  </VStack>
                  <FormLabel htmlFor='phone'>Telefono</FormLabel>
                  <VStack>
                    <Input
                      type='text'
                      name='phone'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      maxW={300}
                    />
                    <Text color='red'>{errors.phone && touched.phone && errors.phone}</Text>
                  </VStack>
                  <FormLabel htmlFor='level'>Nivel de Permisos</FormLabel>
                  <Select maxW={100} value={level} onChange={(e) => setlevel(e.target.value)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                  </Select>
                </HStack>
                <HStack m={4}>
                  <FormLabel htmlFor='direccion'>Direccion</FormLabel>
                  <Textarea
                    type='text'
                    name='address'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    maxW={800}
                    maxH={150}
                  />
                  <Text color='red'>{errors.address && touched.address && errors.address}</Text>
                </HStack>
                <Box ml={4}>
                  <Button type='submit' disabled={isSubmitting} onClick={handleSubmit} maxW={200} w={200}>
                    Guardar
                  </Button>
                </Box>
              </FormControl>
            </Stack>
          </Stack>
        )}
      </Formik>

      {showUser.length > 0 ? (
        <>
          <TableContainer m={5}>
            <Table variant='striped' size='lg'>
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Correo</Th>
                  <Th>Telefono </Th>
                  <Th>Direccion </Th>
                  <Th>Nivel de permisos</Th>
                  <Th>Opciones </Th>
                </Tr>
              </Thead>
              <Tbody>
                {showUser.map((user, key) => (
                  <Tr key={key}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone}</Td>
                    <Td>{user.address}</Td>
                    <Td>{user.level}</Td>
                    <Td>
                      <Button variant='outline' colorScheme='green' mr={2} onClick={() => handleShow(user)}>
                        <EditIcon />
                      </Button>
                      <Button
                        variant='outline'
                        colorScheme='red'
                        onClick={() => {
                          D(user)
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      ) : null}
      <Formik
        initialValues={{ email: '', password: '', corfimPassword: '', name: '', phone: '', address: '' }}
        validate={(values) => {
          const errors = {}
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email || user.email)) {
            errors.email = 'Correo electronico invalido'
          }
          if (!values.password) {
            errors.password = 'La contraseña es requerido'
          }
          if (values.password.length < 6) {
            errors.password = 'La contraseña tiene que tener 6 digitos'
          }
          if (!values.corfimPassword) {
            errors.corfimPassword = 'La contraseña es requerido'
          }
          if (values.corfimPassword.length < 6) {
            errors.corfimPassword = 'La contraseña tiene que tener 6 digitos'
          }
          if (values.password !== values.corfimPassword) {
            errors.corfimPassword = 'Las contrasenas no coinciden'
          }
          return errors
        }}
        onSubmit={async (values, { resetForm }) => {
          updateUSER(values)
          resetForm({ values: '' })
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar empleado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Stack>
                <Stack>
                  <FormControl>
                    <FormLabel htmlFor='email'>Correo electronico</FormLabel>
                    <Input
                      type='email'
                      name='email'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder={user.email}
                      maxW={300}
                    />
                    <Text color='red'>{errors.email && touched.email && errors.email}</Text>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type='password'
                      name='password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      maxW={300}
                    />
                    <Text color='red'>{errors.password && touched.password && errors.password}</Text>
                    <FormLabel htmlFor='password'>Vereficar password</FormLabel>
                    <Input
                      type='password'
                      name='corfimPassword'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.corfimPassword}
                      maxW={300}
                    />
                    <Text color='red'>{errors.corfimPassword && touched.corfimPassword && errors.corfimPassword}</Text>
                    <FormLabel htmlFor='name'>Nombre</FormLabel>
                    <Input
                      type='text'
                      name='name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={user.name}
                      maxW={300}
                    />
                    <HStack mt={2}>
                      <FormLabel htmlFor='phone'>Telefono</FormLabel>
                      <Input
                        type='text'
                        name='phone'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone}
                        placeholder={user.phone}
                        maxW={300}
                      />
                      <FormLabel htmlFor='level'>Nivel de Permisos</FormLabel>
                      <Select maxW={100} defaultValue={user.level} onChange={(e) => setlevelupdate(e.target.value)}>
                        {options.map(function (option, key) {
                          return (
                            <option key={key} value={option.label} selected={option.value == user.level}>
                              {option.label}
                            </option>
                          )
                        })}
                      </Select>
                    </HStack>
                    <FormLabel htmlFor='direccion'>Direccion</FormLabel>
                    <Textarea
                      type='text'
                      name='address'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={user.address}
                      value={values.address}
                      maxW={800}
                      maxH={150}
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Cerrar</Button>
              <Button onClick={handleSubmit}>Guardar Cambios</Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    </>
  )
}
