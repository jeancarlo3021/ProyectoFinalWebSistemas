import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShoppingCart } from '../car/contexts/ShoppingCartContext'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Flex,
  Spacer,
  InputGroup,
  Input,
  Button,
  Image,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react'
import { HamburgerIcon, Search2Icon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import shoppingcart from '../../img/shoppingstorecart_99691.svg'
import { useAuth } from '../Login/AuthProvider'
import userimg from '../../img/round-account-button-with-user-inside_icon-icons.com_72596.svg'
import { useSearch } from './SearchContext'
import ItemList from '../car/components/ItemList'
import '../../styles/App.css'
import { insertCart, existsUsername } from '../firebase'

function Header() {
  const redirect = useNavigate()
  const { user, userBD } = useAuth()
  return (
    <>
      <Flex as='nav' align='center' justify='space-between' wrap='wrap' w='100%' mb={8} p={4} bg='#3E4147'>
        {user !== null ? (
          <Box w='70px' h='10'>
            <Menu>
              <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} w='50px' />
              <MenuList>
                <MenuItem onClick={() => redirect('/product')}>Agregar productos</MenuItem>
                <MenuItem onClick={() => redirect('/newEmployer')}>Agregar empleado</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ) : null}
        <Box w='200px' h='10' bg='grey.500'>
          <Heading color='white'>
            Essentials<span className='dot'>.</span>
          </Heading>
        </Box>
        <Spacer />
        <Box w='600px' h='10'>
          <SearchBar></SearchBar>
        </Box>
        <Spacer />
        <Box w='180px' h='10'>
          <CarUser></CarUser>
        </Box>
      </Flex>
    </>
  )
}

function CarUser() {
  const { setCart, cart, total, ItemsQuantity } = useShoppingCart()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const add = async () => {
    if (user !== null) {
      const object = cart.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})
      const tmp = object
      tmp.purchaser = user.email !== null ? user.email : null
      await insertCart(tmp)
      toast({
        title: 'Productos apartados',
        status: 'success',
        duration: 3000,
        variant: 'subtle',
        position: 'bottom',
      })
      setCart([])
      onClose
    }
  }
  const formateador = new Intl.NumberFormat('es-CR', {
    currencySign: 'standard',
    style: 'currency',
    currency: 'CRC',
  })

  return (
    <>
      <Button onClick={onOpen}>
        <Image borderRadius='full' boxSize='25px' src={shoppingcart} alt='Shopping Cart' />
        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
          {ItemsQuantity}
        </span>
      </Button>
      <Drawer isOpen={isOpen} placement='right' size='md' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Carrito</DrawerHeader>
          <DrawerBody>
            <ItemList />
          </DrawerBody>
          <DrawerFooter>
            <Text mt={5}>Total a pagar: {formateador.format(parseInt(total))}</Text>
            <Button variant='outline' ml={10} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={add}>
              Apartar productos
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <User />
    </>
  )
}

function SearchBar() {
  const { setSearch, search } = useSearch()
  return (
    <InputGroup>
      <span className='input-group-text'>
        <Search2Icon />
      </span>
      <Input
        bg='#f8f9fa'
        type='text'
        borderLeftRadius='0'
        placeholder='Buscar'
        name='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )
}

function User() {
  const { user, logout, exist, userBD } = useAuth()

  const redirect = useNavigate()
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<Image borderRadius='full' boxSize='25px' src={userimg} alt='Shopping Cart' />}
        ml='18px'
        w='50px'
      />
      <MenuList>
        {user !== null ? (
          <>
            <MenuItem onClick={() => logout()}>Cerrar sesion</MenuItem>
            <MenuItem onClick={() => redirect('/updateUser')}>Editar usuario</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => redirect('/login')}>Iniciar sesión</MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}
export default Header
