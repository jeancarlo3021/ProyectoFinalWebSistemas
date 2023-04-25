import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './component/Login/Login'
import NewUser from './component/Login/newUser'
import { AuthProvider } from './component/Login/AuthProvider'
import { ShoppingCartProvider } from './component/car/contexts/ShoppingCartContext'
import Products from './component/Products/Products'
import { NewEmployer } from './component/Employer/NewEmployer'
import { ChakraProvider } from '@chakra-ui/react'
import UpdateUser from './component/Login/UpdateUser'
import { SearchProvider } from './component/Header/SearchContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <SearchProvider>
        <ShoppingCartProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/newUser' element={<NewUser />} />
                <Route path='/product' element={<Products />} />
                <Route path='/newEmployer' element={<NewEmployer />} />
                <Route path='/updateUser' element={<UpdateUser />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ShoppingCartProvider>
      </SearchProvider>
    </ChakraProvider>
  </React.StrictMode>
)
