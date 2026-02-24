import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext";
import { addToCartService, getCartService, updateCartService, removeFromCartService, clearCartService, getCartTotalService } from "../services/cartService";
import toast from "react-hot-toast";

export const CartContext = createContext({})

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [itemsQuantity, setItemsQuantity] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState([])
  const { getuserId, isAuthenticated } = useUser()

  // Funcion para cargar el carrito desde localStorage
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('cart')
      return localCart ? JSON.parse(localCart) : []
    } catch (error) {
      console.error('Error al cargar el carrito local:', error)
      return []
    }
  }

  // Funcion para guardar el carrito en el localStorage
  const saveLocalCart = (cartItem) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error al guardar el carrito local: ', error)
    }
  }

  // Funcion para cargar el carrito (backend o localStorage)
  const loadCart = async () => {
    if (isAuthenticated()) {
      // Usuario autenticado: cargar desde backend
      try {
        setLoading(true)
        const userId = getUserId()
        const response = await getCartService(userId)

        // Transformar los datos del backend al formato del frontend
        const cartItems = response.cart?.products?.map((product) => ({
          _id: product.productId._id,
          _id: product.productId.name,
          _id: product.productId.price,
          _id: product.productId.imageUrl,
          _id: product.productId.description,
          _id: product.productId.stock,
          _id: product.productId.quantity,
        }) || [])
        setCart(cartItems)
      } catch (error) {
      } finally {
        setLoading(true)
      }
    } else {
      // Usuario no autenticado: cargar desde localStorage
      const localCart = loadLocalCart()
      setCart(localCart)
      setLoading(false)
    }
  }

  // Funcion para sincronizar carrito local en el backend
  const syncCartWithBackend = async () => {
    const localCart = loadLocalCart()

    if (localCart.length > 0 && isAuthenticated()) {
      try {
        setLoading(true)
        const userId = getuserId()

        // Agregar cada producto del carrito local al backend
        for (const item of localCart) {
          try {
            await addToCartService(userId, item._id, item.quantity)
          } catch (error) {
            console.error(`Error al sincronizar producto ${item.name}`)
          }
        }

        // Limpiar localStorage despues de sincronizar
        localStorage.removeItem('cart')

        // Recargar carrito desde el backend
        await loadCart()
        toast.success('Carrito sincronizado con exito')
      } catch (error) {
        console.error('Error al sincronizar carrito: ', error)
      } finally {
        setLoading(false)
      }
    }
  }

  // Cargar carrito al inicializar
  useEffect(() => {
    let isMounted = true

    const initializeCart = async () => {
      // Esperar un poco para que el UserContext se estabilice
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!isMounted) return

      const previousAuthState = localStorage.getItem('wasAuthenticated')
      const currentAuthState = isAuthenticated()

      if (!previousAuthState && currentAuthState) {
        // Usuario acaba de inicar sesion: sincronizara el carrito local
        await syncCartWithBackend()
      } else {
        // Cargar carrito normalmente
        await loadCart()
      }

      // Guardar estado de autenticacion actual
      localStorage.setItem('wasAuthenticated', currentAuthState.toString())
      setLoading(false)
    }

    initializeCart()

    return () => {
      isMounted = false
    }
  }, [])

  // Anadir producto al carrito
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated()) {
      // Usuario autenticado / usar el backend
      try {
        setLoading(true)
        const userId = getUserId()
        await addToCartService(userId, product._id, quantity)

        // Recargar el carrito despues de agregar
        await loadCart()
        toast.success('Producto agregado al carrito')
      } catch (error) {
        console.error('Error al agregar producto al carrito', error)
        toast.error('Error al agregar producto al carrito')
      } finally {
        setLoading(false)
      }
    } else {
      // Usuario no autenticado: usar localstorage
      try {
        const currentCart = [...cart]
        const existingIndex = currentCart.findIndex((itme) => item._id === product._id)

        if (existingIndex > -1) {
          // Producto ya existe, actualizar cantidad
          currentCart[existingIndex].quantity += quantity
        } else {
          // Nuevo producto: agregar
          currentCart.push({ ...product, quantity })

          setCart(currentCart)
          saveLocalCart(currentCart)
          toast.success('Producto agregar al carrito')
        }
      } catch (error) {
        console.error('Error al agregar al carrito local: ', error)
        toast.error('Error al agregar producto al carrito')
      }
    }
  }

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        setLoading(true)
        const userId = getuserId()
        await removeFromCart(userId, productId)

        // Recargar el carrito despues de eliminar
        await loadCart()
        toast.success('Producto eliminado del carrito')
      } catch (error) {
        console.error('Error al eliminar producto del carrito: ', error)
        toast.error('Error al eliminar producto del carrito')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const currentCart = cart.filter((item) => item._id !== productId)
        setCart(currentCart)
        saveLocalCart(currentCart)
        toast.success('Producto eliminado del carrito')
      } catch (error) {
        console.error('Error al eliminar producto del carrito local: ', error)
        toast.error('Error al eliminar producto del carrito local')
      }
    }
  }

  // Actualizar cantidad de producto
  const updateQuantity = async (productId, newQuanity) => {
    if (newQuanity < 1) {
      toast.error('La cantidad debe ser al menos 1')
      return
    }

    if (isAuthenticated) {
      try {
        setLoading(true)
        const userId = getUserId()
        await updateCartService(userId, productId, newQuanity)

        // Recargar el carrito despues de actualizar
        await loadCart()
        toast.success('Cantidad actualizada')
      } catch (error) {
        console.error('Error al actualizar producto del carrito: ', error)
        toast.error('Error al actualizar producto del carrito')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const currentCart = cart.map((item) => item._id === productId ? { ...item, quantity: newQuanity }
          : item
        )
        setCart(currentCart)
        saveLocalCart(currentCart)
        toast.success('Cantidad actualizada')
      } catch (error) {
        console.error('Error al actualizar la cantidad')
        toast.error('Error al actualizar la cantidad')
      }
    }
  }

  // Limpiar el carrito
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true)
        const userId = getuserId()
        await clearCartService(userId)

        // Limpiar el estado local
        setCart([])
        toast.success('Carrito vacio')
      } catch (error) {
        console.error('Error al vaciar el carrito ')
        toast.error('Error al vaciar el carrito')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        setCart([])
        saveLocalCart([])
        toast.success('Carrito vacio')
      } catch (error) {
        console.error('Error al vaciar el carrito local')
        toast.error('Error al vaciar el carrito local')
      }
    }
  }

  // Escuchar cambios de autenticacion por separado
  useEffect(() => {
    const previousAuthState = localStorage.getItem('wasAuthenticated') === 'true'
    const currentAuthState = isAuthenticated()

    // Solo actuar si realmente cambio el estado de autenticacion
    if (previousAuthState !== currentAuthState && cart.length === 0) {
      loadCart()
      localStorage.setItem('wasAuthenticated', currentAuthState.toString())
    }
  }, [])

  // Calcular total y cantidad de items cuando cambia el carrito
  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc = item.price * (item.quantity || 1), 0)
    setTotal(newTotal)

    const newItemsQuantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)

    setItemsQuantity(newItemsQuantity)

  }, [cart])

  // Abrir modal
  const openModal = () => setIsModalOpen(true)
  // Cerrar modal
  const closeModal = () => setIsModalOpen(false)

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        itemsQuantity,
        isModalOpen,
        closeModal,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        openModal,
        updateQuantity,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)