import { Routes, Route } from 'react-router'
//import CreateProduct from './CreateProduct'
//import UpdateProduct from './UpdateProducts'
import TableProductDashboard from '../components/AdminDashboard/TableProductDashboard/TableProductDashboard'
import DashboardLayout from '../layout/DashboardLayout'

const AdminDashboard = () => {
  return (
    <section>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<TableProductDashboard />} />
          <Route
            path="products"
            element={<TableProductDashboard />}
          />
          {/**CREATE PRODUCT */}
          {/**UPDATE PRODUCT */}
        </Route>
      </Routes>
    </section>
  )
}

export default AdminDashboard