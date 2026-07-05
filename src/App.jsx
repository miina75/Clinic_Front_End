import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './Layout/MainLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Users from './pages/Users'
import AddEditUsers from './services/AddEditUsers'
import Doctors from './pages/Doctors'
import AddEditDoctors from './services/AddEditDoctors'
import Patients from './pages/Patients'
import AddEditPatients from './services/AddEditPatients'
import Visits from './pages/Visits'
import AddEditVisits from './services/AddEditVisits'
import Prescriptions from './pages/Prescriptions'
import AddEditPrescriptions from './services/AddEditPrescriptions'
import Bills from './pages/Bills'
import AddEditBills from './services/AddEditBills'
import Dashboard from './pages/Dashboard'
import NotFound from './components/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddEditUsers />} />
            <Route path="/users/edit/:id" element={<AddEditUsers />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/add" element={<AddEditDoctors />} />
            <Route path="/doctors/edit/:id" element={<AddEditDoctors />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/add" element={<AddEditPatients />} />
            <Route path="/patients/edit/:id" element={<AddEditPatients />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/visits/add" element={<AddEditVisits />} />
            <Route path="/visits/edit/:id" element={<AddEditVisits />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/prescriptions/add" element={<AddEditPrescriptions />} />
            <Route path="/prescriptions/edit/:id" element={<AddEditPrescriptions />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/bills/add" element={<AddEditBills />} />
            <Route path="/bills/edit/:id" element={<AddEditBills />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}