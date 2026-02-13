import { useContext, createContext, useState, useEffect } from "react";
import { getProfileService } from "../services/authServices";
export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(true)

  // Funcion para verificar la sesion del usuario
  const checkSession = async () => {
    try {
      setLoading(true)
      const userData = await getProfileService()
      setUserInfo(userData)
    } catch (error) {
      console.log('No hay sesion activa:', error)
      setUserInfo({})
    } finally {
      setLoading(false)
    }
  }

  // Funcion para obtener el id del usuario autenticado
  const getUserId = () => {
    return userInfo?.id || null
  }

  // Verificar si el usuario esta autenticado  o no
  const isAuthenticated = () => {
    return !!userInfo?.id
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <UserContext.Provider value={{
      userInfo,
      setLoading,
      loading,
      checkSession,
      getUserId,
      isAuthenticated,
      setUserInfo
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)