import { Link } from "react-router"
import { AuthButtons } from "./AuthButtons"
import { Cart } from "./Cart"
import { UserDropDown } from "./UserDropDown"
import { useUser } from "../../context/UserContext"

const Navbar = () => {

  const { loading, userInfo } = useUser()

  return (
    <header>
      <AuthButtons />
      <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/">E-commerce</Link>
        </div>
        <div className="navbar-end gap-3">
          {
            userInfo?.isAdmin && (
              <a className="btn btn-primary">Dashboard</a>
            )
          }
          <Cart />
          {
            !loading && userInfo?.usename && <UserDropDown />
          }
        </div>
      </nav>
    </header>
  )
}

export default Navbar