import { createContext, useContext, useState } from 'react'
import { updateProduct } from '../../firebase'

export const ShoppingCartContext = createContext()

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext)
  if (!context) throw new Error('no hay que provedor de auntenticacion')
  return context
}

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([])
  const total = cart.reduce((acc, el) => acc + parseInt(el.price * el.quantity), 0)

  const ItemsQuantity = cart.reduce((acc, el) => acc + parseInt(el.quantity), 0)

  const buyProducts = (product) => {
    const productrepeat = cart.find((item) => item.id === product.id)

    if (productrepeat) {
      productrepeat.quantity < product.cant &&
        setCart(
          cart.map((item) => (item.id === product.id ? { ...product, quantity: productrepeat.quantity + 1 } : item))
        )
    } else {
      const tmp = product
      tmp.quantity = 1
      setCart([...cart, tmp])
    }
  }
  const decrese = (product) => {
    const productrepeat = cart.find((item) => item.id === product.id)
    productrepeat.quantity !== 1 &&
      setCart(
        cart.map((item) => (item.id === product.id ? { ...product, quantity: productrepeat.quantity - 1 } : item))
      )
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        cart,
        setCart,
        total,
        buyProducts,
        decrese,
        ItemsQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}
