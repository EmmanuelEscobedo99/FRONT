import { CgTrash } from "react-icons/cg";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router";

const ModalCart = () => {
  const {
    cart,
    closeModal,
    isModalOpen,
    itemsQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart()

  if (!isModalOpen) return null // Solo renderizara si el modal esta abierto

  return (
    <div className="modal modal-open px-4">
      <h1>MODAL</h1>
    </div>
  )
}

export default ModalCart