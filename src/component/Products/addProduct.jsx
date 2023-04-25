import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Deletefile,
  deleteProduct,
  getProduct,
  getUrl,
  insertNewProduct,
  ProfilePhoto,
  updateProduct,
} from '../firebase'
import {
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
  Image,
  AspectRatio,
  Text,
  SimpleGrid,
  Container,
  useToast,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useAuth } from '../Login/AuthProvider'
import { Form, Modal, Table } from 'react-bootstrap'

const Add = () => {
  const [show, setShow] = useState(false)
  const toast = useToast()
  const [showinfo, setShowinfo] = useState(false)
  const [alert, setalert] = useState({
    title: '',
    text: '',
  })
  const [docId, setdocId] = useState('')
  const [Product, setProduct] = useState({
    name: '',
    id: '',
    price: 0,
    imgProduct: '',
    pathProduct: '',
    cant: 0,
    addUser: '',
    description: '',
    docId: '',
  })
  const handleClose = () => {
    setFile(null)
    setShow(false)
  }
  const handleShow = (product) => {
    const P = showProduct.find((item) => item.docId === product.docId)
    setProduct(P)
    setShow(true)
  }

  const [showProduct, setShowProduct] = useState([])
  const [file, setFile] = useState(null)
  const [path, setpath] = useState({
    url: '',
    dir: '',
  })

  const showpro = async () => {
    const resproduct = await getProduct()
    setShowProduct([...resproduct])
  }

  useEffect(() => {
    showpro()
  }, [])
  const { user } = useAuth()
  //añadir nuevo elemnto
  const addProduct = async (product) => {
    if (file !== null) {
      product.id = uuidv4()
      const photo = await ProfilePhoto(product.id, file)
      const url = await getUrl(photo.metadata.fullPath)
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        imgProduct: url,
        pathProduct: photo.metadata.fullPath,
        cant: product.cant,
        description: product.description,
        nameUser: user.email,
      }
      const res = await insertNewProduct(newProduct)
      toast({
        title: 'Articulo agregado',
        status: 'success',
        duration: 3000,
        variant: 'subtle',
        position: 'bottom-right',
      })
      setFile(null)
      setShowProduct([...showProduct, newProduct])
    }
  }
  // docId es el id que va actualizar
  const updatePr = async (update) => {
    const UPProduct = {
      name: update.name !== '' ? update.name : Product.name,
      price: update.price !== '' ? update.price : Product.price,
      imgProduct: path.url !== '' ? path.url : Product.imgProduct,
      pathProduct: path.dir !== '' ? path.dir : Product.pathProduct,
      cant: update.cant !== '' ? update.cant : Product.cant,
      description: update.description !== '' ? update.description : Product.description,
      nameUser: user.email,
    }

    await updateProduct(Product.docId, UPProduct)
    const tmp = showProduct.find((item) => item.docId !== update.docId)
    setShowProduct([...showProduct, Product])
    handleClose()
    toast({
      title: 'Articulo actualizado',
      status: 'success',
      duration: 3000,
      variant: 'subtle',
      position: 'bottom-right',
    })
    setProduct({
      name: '',
      price: 0,
      imgProduct: '',
      cant: 0,
      description: '',
      nameUser: '',
    })
  }

  const deleted = async (product) => {
    await deleteProduct(product.docId)
    await Deletefile(product.pathProduct)
    const tmp = showProduct.filter((link) => link.docId !== Product.docId)
    setShowProduct([...tmp])
    toast({
      title: 'Articulo eliminado',
      status: 'success',
      duration: 3000,
      variant: 'subtle',
      position: 'bottom-right',
    })
    setShowinfo(true)
  }

  const Updatefile = async (file) => {
    const photo = await ProfilePhoto(Product.id, file)
    const url = await getUrl(photo.metadata.fullPath)
    setFile(null)
    setFile(url)
    setpath({
      url: url,
      dir: photo.metadata.fullPath,
    })
  }

  const formateador = new Intl.NumberFormat('es-CR', {
    currencySign: 'standard',
    style: 'currency',
    currency: 'CRC',
  })

  return (
    <>
      <Formik
        initialValues={{ name: '', price: '', cant: '', description: '' }}
        validate={(values) => {
          const errors = {}
          if (!values.name) {
            errors.name = 'nombre del articulo requerido'
          }
          if (!values.price) {
            errors.price = 'Precio requerido'
          }
          if (values.price <= 0) {
            errors.price = 'El precio no puede ser menor a 0'
          }
          if (!values.cant) {
            errors.cant = 'Cantidad requerida'
          }
          if (values.cant <= 0) {
            errors.cant = 'La cantidad no puede ser menor a 0'
          }
          if (!values.description) {
            errors.description = 'La descripccion es requerida'
          }

          return errors
        }}
        onSubmit={async (values, { resetForm }) => {
          addProduct(values)
          resetForm({ values: '' })
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Stack mt={5}>
            <Center>
              <Heading>Incluir nuevo producto</Heading>
            </Center>
            <Stack>
              <FormControl>
                <SimpleGrid columns={[2]} spacing='100px'>
                  <Box w={600}>
                    <HStack m={4}>
                      <FormLabel htmlFor='name'>Nombre</FormLabel>
                      <Input
                        type='text'
                        name='name'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        maxW={300}
                      />
                      <Text color='red'>{errors.name && touched.name && errors.name}</Text>
                    </HStack>
                    <HStack spacing={5} m={4}>
                      <FormLabel>Precio</FormLabel>
                      <VStack>
                        <Input
                          type='text'
                          name='price'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.price}
                          maxW={300}
                        />
                        <Text color='red'>{errors.price && touched.price && errors.price}</Text>
                      </VStack>
                      <FormLabel htmlFor='cant'>Cantidad</FormLabel>
                      <VStack>
                        <Input
                          type='cant'
                          name='cant'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.cant}
                          maxW={300}
                        />
                        <Text color='red'>{errors.cant && touched.cant && errors.cant}</Text>
                      </VStack>
                    </HStack>
                    <HStack m={4}>
                      <FormLabel htmlFor='description'>Descripcion</FormLabel>
                      <Textarea
                        type='text'
                        name='description'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        maxW={800}
                        maxH={150}
                      />
                      <Text color='red'>{errors.description && touched.description && errors.description}</Text>
                    </HStack>
                  </Box>
                  <Box>
                    <Form.Group controlId='formFile' className='mb-3'>
                      <Form.Label>Imagen del Articulo</Form.Label>
                      <Form.Control type='file' onChange={(e) => setFile(e.target.files[0])} />
                    </Form.Group>
                  </Box>
                </SimpleGrid>
                <Box ml={4}>
                  <Button type='submit' onClick={handleSubmit} maxW={200} w={200}>
                    Guardar
                  </Button>
                </Box>
              </FormControl>
            </Stack>
          </Stack>
        )}
      </Formik>
      {/* {user.level < 2 ? ( */}
      {showProduct.length > 0 ? (
        <Table className='m-2  mt-4' striped hover>
          <thead>
            <tr>
              <th>
                <Center>Imagen</Center>
              </th>
              <th>Nombre del Producto</th>
              <th>Cantidad </th>
              <th>Precio </th>
              <th>Descripccion</th>
              <th>Usuario que lo agrego </th>
              <th>Opciones </th>
            </tr>
          </thead>
          <tbody>
            {showProduct.map((product, key) => (
              <tr key={key}>
                <td>
                  <Center>
                    <AspectRatio w='250px' h='250px'>
                      <Image src={product.imgProduct} alt='' />
                    </AspectRatio>
                  </Center>
                </td>
                <td>
                  <Center>{product.name}</Center>
                </td>
                <td>
                  <Center>{product.cant}</Center>
                </td>
                <td>
                  <Center>{formateador.format(parseInt(product.price))}</Center>
                </td>
                <td>
                  <Container w='150'>{product.description}</Container>
                </td>
                <td>
                  <Center>{product.nameUser}</Center>
                </td>
                <td>
                  <HStack>
                    <Button variant='outline' colorScheme='green' mr={2} onClick={() => handleShow(product)}>
                      <EditIcon />
                    </Button>
                    <Button
                      variant='outline'
                      colorScheme='red'
                      onClick={() => {
                        deleted(product)
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </HStack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
      <>
        <Formik
          initialValues={{ name: '', price: '', cant: '', description: '' }}
          validate={(values) => {
            const errors = {}
            if (values.price < 0) {
              errors.price = 'El precio no puede ser menor a 0'
            }
            if (values.cant < 0) {
              errors.cant = 'La cantidad no puede ser menor a 0'
            }
            return errors
          }}
          onSubmit={(values, { resetForm }) => {
            updatePr(values)
            resetForm({ values: '' })
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Actualizar producto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder={Product.name}
                      name='name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={Product.cant}
                      name='cant'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cant}
                    />
                    <Text color='red'>{errors.cant && touched.cant && errors.cant}</Text>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder={Product.price}
                      name='price'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                    />
                    <Text color='red'>{errors.price && touched.price && errors.price}</Text>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Descripccion</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      placeholder={Product.description}
                      name='description'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Imagen del Articulo</Form.Label>
                    <Form.Control
                      type='file'
                      name='file'
                      onChange={(e) => Updatefile(e.target.files[0])}
                      className='mb-3'
                    />
                    <img src={file === null ? Product.imgProduct : file} alt='' />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose}>Cerrar</Button>
                <Button onClick={handleSubmit}>Guardar Cambios</Button>
              </Modal.Footer>
            </Modal>
          )}
        </Formik>
        <Modal show={showinfo} onHide={() => setShowinfo(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{alert.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{alert.text}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowinfo(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  )
}

export default Add
