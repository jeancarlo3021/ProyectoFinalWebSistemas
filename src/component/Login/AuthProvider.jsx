import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  updateEmail,
} from 'firebase/auth'
import { auth, existsUsername } from '../firebase'

export const authcontext = createContext()

export const useAuth = () => {
  const context = useContext(authcontext)
  if (!context) throw new Error('no hay que provedor de auntenticacion')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userBD, setUserBD] = useState([])
  const [loading, setLoading] = useState(true)

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const logout = () => signOut(auth)
  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider()
    return signInWithPopup(auth, googleProvider)
  }
  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  // actualizar datos
  const updatePass = (password) => updatePassword(user, password)
  const updatemail = (email) => updateEmail(user, email)
  const updateUser = (name, photoURL) => updateProfile(user, { name, photoURL })

  const exist = (email) => existsUsername(email)

  //obtener usuario actual
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubcribe()
  }, [])

  return (
    <authcontext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        resetPassword,
        updatemail,
        updatePass,
        updateUser,
        userBD,
      }}
    >
      {children}
    </authcontext.Provider>
  )
}
