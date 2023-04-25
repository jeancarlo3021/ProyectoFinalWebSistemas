import { useShoppingCart } from '../contexts/ShoppingCartContext'
import { Box, Image, Text, IconButton, Card, CardBody, Stack, Center, Heading, Button, HStack } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

const CartElements = () => {
  const { cart, setCart, buyProducts, decrese } = useShoppingCart()
  const formateador = new Intl.NumberFormat('es-CR', {
    currencySign: 'standard',
    style: 'currency',
    currency: 'CRC',
  })
  const deleteProduct = (product) => {
    const foundId = cart.find((item) => item.id === product.id)
    const newCart = cart.filter((element) => {
      return element !== foundId
    })
    setCart(newCart)
  }
  return (
    <>
      <Stack>
        {cart.map((product, key) => {
          return (
            <Box mb={5} key={key}>
              <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline' h='150px'>
                <Image objectFit='cover' maxW={{ base: '100%', sm: '200px' }} src={product.imgProduct} alt='' />
                <IconButton
                  variant='ghost'
                  icon={<CloseIcon />}
                  fontWeight='700'
                  position='absolute'
                  top='1'
                  right='2'
                  onClick={() => deleteProduct(product)}
                />
                <Stack>
                  <CardBody>
                    <Center>
                      <Heading size='md' mt='5px'>
                        {product.name}
                      </Heading>
                    </Center>
                    <HStack position='absolute' bottom='2'>
                      <Button variant='ghost' onClick={() => decrese(product)}>
                        -
                      </Button>
                      <Text fontWeight='700' fontSize='md'>
                        {product.quantity}
                      </Text>
                      <Button variant='ghost' onClick={() => buyProducts(product)}>
                        +
                      </Button>
                    </HStack>
                    <Text color='blue.700' fontWeight='700' fontSize='md' position='absolute' bottom='0' right='8'>
                      {formateador.format(parseInt(product.price * product.quantity))}
                    </Text>
                  </CardBody>
                </Stack>
              </Card>
            </Box>
          )
        })}
      </Stack>
    </>
  )
}

export default CartElements
