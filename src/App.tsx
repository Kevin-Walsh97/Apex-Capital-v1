import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import LoginPage from './pages/LoginPage'
import GPLayout from './components/layout/GPLayout'
import LPLayout from './components/layout/LPLayout'
import GPOverview from './pages/gp/GPOverview'
import GPDocuments from './pages/gp/GPDocuments'
import GPPipeline from './pages/gp/GPPipeline'
import GPAnalytics from './pages/gp/GPAnalytics'
import GPDataRoom from './pages/gp/GPDataRoom'
import LPDiscover from './pages/lp/LPDiscover'
import LPFundDetail from './pages/lp/LPFundDetail'
import LPDocuments from './pages/lp/LPDocuments'
import LPCompare from './pages/lp/LPCompare'
import LPCalendar from './pages/lp/LPCalendar'
import LPMyFunds from './pages/lp/LPMyFunds'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: 'GP' | 'LP' }) {
  const currentUser = useStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={`/${currentUser.role.toLowerCase()}`} replace />
  return <>{children}</>
}

function App() {
  const currentUser = useStore((s) => s.currentUser)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/gp"
        element={
          <ProtectedRoute role="GP">
            <GPLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GPOverview />} />
        <Route path="documents" element={<GPDocuments />} />
        <Route path="pipeline" element={<GPPipeline />} />
        <Route path="analytics" element={<GPAnalytics />} />
        <Route path="dataroom" element={<GPDataRoom />} />
      </Route>
      <Route
        path="/lp"
        element={
          <ProtectedRoute role="LP">
            <LPLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LPDiscover />} />
        <Route path="funds/:fundId" element={<LPFundDetail />} />
        <Route path="funds" element={<LPMyFunds />} />
        <Route path="qa" element={<LPDiscover />} />
        <Route path="documents" element={<LPDocuments />} />
        <Route path="compare" element={<LPCompare />} />
        <Route path="calendar" element={<LPCalendar />} />
      </Route>
      <Route
        path="*"
        element={
          <Navigate to={currentUser ? `/${currentUser.role.toLowerCase()}` : '/login'} replace />
        }
      />
    </Routes>
  )
}

export default App
