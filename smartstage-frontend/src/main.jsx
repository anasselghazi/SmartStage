import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Recherche from './pages/Recherche'
import Attestation from './pages/Attestation'
import AdminComptes from './pages/AdminComptes'
import ImportExcel from './pages/ImportExcel'
import Historique from './pages/HistoriquePage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route attente validation */}
          <Route path="/attente" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="bg-white p-8 rounded-lg shadow text-center max-w-md">
                <h2 className="text-xl font-bold text-yellow-600 mb-4">Compte en attente</h2>
                <p className="text-gray-600">Votre compte est en attente de validation par l'administrateur. Veuillez patienter.</p>
              </div>
            </div>
          } />

          {/* Routes protégées RH */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/recherche" element={
            <PrivateRoute><Recherche /></PrivateRoute>
          } />
          <Route path="/attestation" element={
            <PrivateRoute><Attestation /></PrivateRoute>
          } />
          <Route path="/historique" element={
            <PrivateRoute><Historique /></PrivateRoute>
          } />

          {/* Routes protégées Admin */}
          <Route path="/admin/comptes" element={
            <PrivateRoute adminOnly={true}><AdminComptes /></PrivateRoute>
            
          } />
          <Route path="/admin/import" element={
             <PrivateRoute adminOnly={true}><ImportExcel /></PrivateRoute>
          } />

          {/* Redirect par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
