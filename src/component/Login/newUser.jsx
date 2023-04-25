import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Formik } from 'formik'
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
  Textarea,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const newUser = () => {
  const redirect = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState()

  const { signup } = useAuth()

  const handleGoogleSignin = async () => {
    const log = await loginWithGoogle()
  }

  return (
    <div>
      <Flex minH={'120vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={15} mx={'auto'} maxW={'1500px'} py={18} px={10}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Crea tu propia cuenta</Heading>
          </Stack>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
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
              if (values.confirmPassword.length < 6) {
                errors.corfimPassword = 'La contraseña tiene que tener 6 digitos'
              }
              if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Las contrasenas no coinciden'
              }
              return errors
            }}
            onSubmit={async (values) => {
              try {
                await signup(values.email, values.password)
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
                    <Input type='email' name='email' onChange={handleChange} onBlur={handleBlur} value={values.email} />
                    <Text color='red'>{errors.email && touched.email && errors.email}</Text>
                  </FormControl>
                  <FormControl id='password'>
                    <FormLabel>Contraseña</FormLabel>
                    <Input type='password' onChange={handleChange} onBlur={handleBlur} value={values.password} />
                    <Text color='red'>{errors.password && touched.password && errors.password}</Text>
                  </FormControl>
                  <FormControl id='confirmPassword'>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <Input type='password' onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} />
                    <Text color='red'>
                      {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                    </Text>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack spacing={8}>
                      <Button onClick={handleSubmit}>Registrarme</Button>
                      <Divider />
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        onClick={handleGoogleSignin}
                      >
                        Registrarme con Google
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Formik>
        </Stack>
      </Flex>
    </div>
  )
}

export default newUser
