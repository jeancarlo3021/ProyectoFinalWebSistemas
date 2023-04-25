import { Container, Modal, Col, Row, Button } from 'react-bootstrap'
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Center,
  Box,
  Skeleton,
  Wrap,
  WrapItem,
  useToast,
} from '@chakra-ui/react'
import '../../styles/App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useState } from 'react'
import { getProduct, updateProduct } from '../firebase'
import { useShoppingCart } from '../car/contexts/ShoppingCartContext'
import { useSearch } from '../Header/SearchContext'
import { useAuth } from '../Login/AuthProvider'

const producto = () => {
  const [showProduct, setShowProduct] = useState([])
  const [Filter, setFilter] = useState([])
  const [show, setShow] = useState(false)
  const [Product, setProduct] = useState({})
  const toast = useToast()
  const { user } = useAuth()
  const { search } = useSearch()

  const [loaded, setloaded] = useState(false)
  const { buyProducts } = useShoppingCart()

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
  }

  const handleProduct = (product) => {
    handleShow
    const P = showProduct.find((item) => item.docId === product.docId)
    setProduct(P)
  }

  const handleClick = async () => {
    if (user !== null) {
      buyProducts(Product)
    }

    handleClose()
  }

  const showpro = async () => {
    const resproduct = await getProduct()
    setShowProduct([...resproduct])
  }
  useEffect(() => {
    if (showProduct !== null) {
      showpro()
      setloaded(true)
    }
  }, [])

  useEffect(() => {
    const s = showProduct.filter((p) => {
      return p.name.toLowerCase().includes(search.toLowerCase())
    })
    setFilter(s)
  }, [search, showProduct])

  const formateador = new Intl.NumberFormat('es-CR', {
    currencySign: 'standard',
    style: 'currency',
    currency: 'CRC',
  })

  return (
    <>
      <Skeleton height='450px' isLoaded={loaded}>
        <Wrap ml='75px'>
          {Filter.map((product, key) => (
            <WrapItem key={key}>
              <Box mr='10px'>
                <Button variant='light' onClick={handleShow}>
                  <Card maxW='sm' boxSize='350px' onClick={() => handleProduct(product)}>
                    <CardBody>
                      <Center>
                        <Image src={product.imgProduct} alt='' borderRadius='lg' w='175px' />
                      </Center>
                      <Stack mt='6' spacing='3'>
                        <Heading size='md'>{product.name}</Heading>
                        <Text color='blue.600' fontSize='2xl'>
                          {formateador.format(parseInt(product.price))}
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                </Button>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Skeleton>
      <Modal show={show} onHide={handleClose} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>{Product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={6} className='d-inline-block'>
                <Center>
                  <Image src={Product.imgProduct} alt='' h='350px' />
                </Center>
              </Col>
              <Col xs={8} md={6}>
                <Row>
                  <Col xs={12} md={6}>
                    <Center>
                      <p>{Product.description}</p>
                    </Center>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} md={6}>
                    <Stack mt='6' spacing='3'>
                      <Box w='500px'>
                        <Text color='blue.700' fontWeight='700' fontSize='xl' position='absolute' bottom='0' right='8'>
                          {formateador.format(parseInt(Product.price))}
                        </Text>
                      </Box>
                    </Stack>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleClose}>
            Close
          </Button>
          <Button className='p' onClick={handleClick}>
            Añadir al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default producto
