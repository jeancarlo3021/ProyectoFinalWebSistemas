import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { Modal } from 'react-bootstrap'
import { Formik } from 'formik'

export default function LoginView() {
  const toast = useToast()
  const toastIdRef = useRef()
  const redirect = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: '',
    password2: '',
  })
  const [show, setShow] = useState(false)
  const [error, setError] = useState()
  const { login, loginWithGoogle, resetPassword } = useAuth()

  const handleGoogleSignin = async () => {
    const log = await loginWithGoogle()
    addToast()
    redirect('/')
  }

  const addToast = () => {
    toastIdRef.current = toast({
      title: 'Bienvenido a la tienda Essentials',
      status: 'success',
      duration: 3000,
      variant: 'subtle',
      position: 'bottom-right',
    })
  }

  return (
    <div>
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Inicia sesión en tu cuenta</Heading>
          </Stack>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values) => {
              const errors = {}
              if (!values.email) {
                errors.email = 'Required'
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
              }
              if (!values.password) {
                errors.password = 'Required'
              }
              if (values.password.length < 6) {
                errors.password = 'La contraseña tiene que tener 6 digitos'
              }

              return errors
            }}
            onSubmit={async (values) => {
              try {
                await login(values.email, values.password)
                toast({
                  title: 'Bienvenido a la tienda Essentials',
                  status: 'success',
                  duration: 3000,
                  variant: 'subtle',
                  position: 'bottom-right',
                })
                redirect('/')
              } catch (error) {
                setError(error.message)
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                <Stack spacing={4}>
                  <FormControl id='email'>
                    <FormLabel>Correo electrónico</FormLabel>
                    <Input type='email' onChange={handleChange} onBlur={handleBlur} value={values.email} />
                    <Text color='red'>{errors.email && touched.email && errors.email}</Text>
                  </FormControl>
                  <FormControl id='password'>
                    <FormLabel>Contraseña</FormLabel>
                    <Input type='password' onChange={handleChange} onBlur={handleBlur} value={values.password} />
                    <Text color='red'>{errors.password && touched.password && errors.password}</Text>
                    <Text color='red'>{error && error}</Text>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                      <Link color={'blue.400'} onClick={() => setShow(true)}>
                        Olvidó su contraseña?
                      </Link>
                    </Stack>
                    <Stack spacing={8}>
                      <Button onClick={() => redirect('/newUser')}>Registrarme</Button>
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        onClick={handleSubmit}
                      >
                        Iniciar sesión
                      </Button>
                      <Divider />
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        onClick={handleGoogleSignin}
                      >
                        Iniciar sesión con Google
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Formik>
        </Stack>
      </Flex>

      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {}
          if (!values.email) {
            errors.email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address'
          }
          return errors
        }}
        onSubmit={async (values) => {
          try {
            await resetPassword(values.email)
          } catch (error) {
            setError(error.message)
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Olvidó su contraseña?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Text> Digite su correo electronico para hacerle llegar por medio de correo el cambio de contraseña</Text>
              <FormControl id='email'>
                <FormLabel>Correo electrónico</FormLabel>
                <Input type='email' onChange={handleChange} onBlur={handleBlur} value={values.email} />
                <Text color='red'>{errors.email && touched.email && errors.email}</Text>
              </FormControl>
              <Text color='red'>{error && error}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShow(false)}>Cerrar</Button>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Iniciar sesión
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    </div>
  )
}
