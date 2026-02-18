import { createContext, useCallback, useContext, useEffect, useState } from "react";

import axios from "axios";

axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACKEND_URL + '/products'

export const ProductContext = createContext({})

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState([])
  const [product, setProduct] = useState({})
  const [productLoading, setProductLoading] = useState(true)
  const [error, setError] = useState(null)

  // Funcion para obtener productos
  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get(API_URL)
      setProducts(response.data)
    } catch (error) {
      setError(error.message || 'Error al obtener los productos')
    } finally {
      setProductsLoading(false)
    }
  }, [])

  // Funcion para obtener un producto por Id
  const getProductById = useCallback(async (id) => {
    setProductLoading(true)
    setProduct({})
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      setProduct(response.data)
      console.log(response.data)
    } catch (error) {
      setError(error.message || 'Error al obtener el producto')
    } finally {
      setProductLoading(false)
    }
  }, [])

  useEffect(() => {
    getProducts()
  }, [getProducts])


  const value = {
    products,
    product,
    productsLoading,
    productLoading,
    error,
    getProducts,
    getProductById
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

// Hook personalizado
export const useProduct = () => useContext(ProductContext)