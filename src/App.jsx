import { Routes, Route } from "react-router"
import { Layout } from "./layout/Layout"
import { Home } from "./pages/Home"
function App() {

  return (

    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />}></Route>
      </Route>
    </Routes>

  )
}

export default App
