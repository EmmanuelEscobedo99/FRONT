import { Link } from "react-router"

export const AuthButtons = () => {
  return (
    <div className="py-4 flex justify-center gap-4 flex-wrap">
      <Link className="btn btn-neutral btn-outline" to={'/register'}>Crear Cuenta</Link>
      <div className="hidden lg:block"></div>
      <Link className="btn btn-neutral btn-outline" to={'/login'}>Iniciar sesión</Link>
    </div>
  )
}
