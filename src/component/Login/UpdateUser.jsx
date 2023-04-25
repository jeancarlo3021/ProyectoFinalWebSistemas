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
  useToast,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Update = () => {
  const toast = useToast()
  const { user, updatePass, updatemail, updateUser } = useAuth()
  const [error, setError] = useState()
  const redirect = useNavigate()

  return (
    <div>
      <Flex minH={'90vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={15} mx={'auto'} maxW={'4xl'} py={18} px={10}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Actualizar Usuario</Heading>
          </Stack>
          <Formik
            initialValues={{
              name: '',
              phone: '',
              address: '',
              password: '',
              corfimPassword: '',
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
              if (!values.name) {
                errors.name = 'Nombre completo requerido'
              }
              if (!values.phone) {
                errors.phone = 'Número de teléfono requerido'
              }
              if (!values.address) {
                errors.address = 'Dirrección requerida'
              }
              return errors
            }}
            onSubmit={async (values) => {
              try {
                await updatemail(values.email)
                await updatePass(values.password)
                await updateUser(values.name)
                toast({
                  title: 'Datos actualizados',
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
                  <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                    <FormControl id='email'>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <Input type='email' onChange={handleChange} onBlur={handleBlur} value={values.email} />
                      <Text color='red'>{errors.email && touched.email && errors.email}</Text>
                    </FormControl>
                  </Stack>

                  <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                    <FormControl id='name'>
                      <FormLabel>Nombre</FormLabel>
                      <Input type='text' onChange={handleChange} onBlur={handleBlur} value={values.name} />
                      <Text color='red'>{errors.name && touched.name && errors.name}</Text>
                    </FormControl>
                    <FormControl id='phone'>
                      <FormLabel>Teléfono</FormLabel>
                      <Input type='text' onChange={handleChange} onBlur={handleBlur} value={values.phone} />
                      <Text color='red'>{errors.phone && touched.phone && errors.phone}</Text>
                    </FormControl>
                  </Stack>
                  <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                    <FormControl id='password'>
                      <FormLabel>Contraseña</FormLabel>
                      <Input type='password' onChange={handleChange} onBlur={handleBlur} value={values.password} />
                      <Text color='red'>{errors.password && touched.password && errors.password}</Text>
                    </FormControl>
                    <FormControl id='confirmPassword'>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <Input
                        type='password'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                      />
                      <Text color='red'>
                        {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                      </Text>
                    </FormControl>
                  </Stack>
                  <FormControl id='address'>
                    <FormLabel>Dirección</FormLabel>
                    <Textarea onChange={handleChange} onBlur={handleBlur} value={values.address} />
                    <Text color='red'>{errors.address && touched.address && errors.address}</Text>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack spacing={8}>
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        onClick={handleSubmit}
                      >
                        Actualizar
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Formik>
        </Stack>
      </Flex>
      {/* termina validacion  */}

      {/* termina validacion  */}
      {/*        
          // <form >
          //   <label htmlFor='email'>Correo electronico</label>
          //   <input type='email' name='email' onChange={handleChange} onBlur={handleBlur} value={values.email} />
          //   {errors.email && touched.email && errors.email}
          //   <input
          //     type='password'
          //     name='password'
          //     onChange={handleChange}
          //     onBlur={handleBlur}
          //     value={values.password}
          //   />
          //   {errors.password && touched.password && errors.password}
          //   <label htmlFor='password'>Vereficar password</label>
          //   <input
          //     type='password'
          //     name='corfimPassword'
          //     onChange={handleChange}
          //     onBlur={handleBlur}
          //     value={values.corfimPassword}
          //   />
          //   {errors.corfimPassword && touched.corfimPassword && errors.corfimPassword}
          //   <label htmlFor='name'>Nombre</label>
          //   <input type='text' name='name' onChange={handleChange} onBlur={handleBlur} value={values.name} />
          //   {errors.name && touched.name && errors.name}
          //   <label htmlFor='phone'>telefono</label>
          //   <input type='text' name='phone' onChange={handleChange} onBlur={handleBlur} value={values.phone} />
          //   {errors.phone && touched.phone && errors.phone}
          //   <label htmlFor='direccion'>Direccion</label>
          //   <input type='text' name='address' onChange={handleChange} onBlur={handleBlur} value={values.address} />
          //   {errors.address && touched.address && errors.address}
          //   <button type='submit' disabled={isSubmitting}>
          //     Submit
          //   </button>
          // </form> */}
    </div>
  )
}

export default Update
