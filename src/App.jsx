import { Routes, Route } from "react-router"
import { Layout } from "./layout/Layout"
import { Home } from "./pages/Home"
import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import { UserContextProvider } from "./context/UserContext"
import { Toaster } from "react-hot-toast"
import { ProductContextProvider } from "./context/ProductContext"
function App() {

  return (

    <UserContextProvider>
      <ProductContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Route>
        </Routes>
        <Toaster />
      </ProductContextProvider>
    </UserContextProvider>

  )
}

export default App
