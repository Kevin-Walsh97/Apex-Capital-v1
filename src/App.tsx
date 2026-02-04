import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import type { UserRole } from './types'
import LoginPage from './pages/LoginPage'
import GPLayout from './components/layout/GPLayout'
import AdvisorLayout from './components/layout/AdvisorLayout'
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

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) {
  const currentUser = useStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard
    const redirectPath = currentUser.role === 'Advisor' ? '/advisor' : `/${currentUser.role.toLowerCase()}`
    return <Navigate to={redirectPath} replace />
  }
  return <>{children}</>
}

function App() {
  const currentUser = useStore((s) => s.currentUser)

  const getDefaultPath = () => {
    if (!currentUser) return '/login'
    if (currentUser.role === 'Advisor') return '/advisor'
    return `/${currentUser.role.toLowerCase()}`
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Advisor routes - can see all funds across firms */}
      <Route
        path="/advisor"
        element={
          <ProtectedRoute allowedRoles={['Advisor']}>
            <AdvisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GPOverview />} />
        <Route path="documents" element={<GPDocuments />} />
        <Route path="pipeline" element={<GPPipeline />} />
        <Route path="analytics" element={<GPAnalytics />} />
        <Route path="dataroom" element={<GPDataRoom />} />
      </Route>

      {/* GP routes - can only see their firm's funds */}
      <Route
        path="/gp"
        element={
          <ProtectedRoute allowedRoles={['GP']}>
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

      {/* LP routes */}
      <Route
        path="/lp"
        element={
          <ProtectedRoute allowedRoles={['LP']}>
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

      <Route path="*" element={<Navigate to={getDefaultPath()} replace />} />
    </Routes>
  )
}

export default App
