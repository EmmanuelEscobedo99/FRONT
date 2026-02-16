import { useState } from "react"
import CardProduct from "../components/CardProduct/CardProduct"
import { useProduct } from "../context/ProductContext"

export const Home = () => {
  const { products, productsLoading, error } = useProduct()

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 3

  // Calcular índices
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(products.length / productsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-5 justify-center">
        {productsLoading ? (
          <div className="loading loading-spinner"></div>
        ) : error ? (
          <p>Error al cargar los productos</p>
        ) : (
          currentProducts.map((product) => (
            <CardProduct key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Paginación */}
      {!productsLoading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="btn btn-outline"
          >
            Anterior
          </button>

          <span className="font-semibold">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="btn btn-outline"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
