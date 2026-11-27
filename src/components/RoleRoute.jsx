import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { Loading } from './Status.jsx'

//UI ONLY: real protection is firestore.rules
function RoleRoute({ roles }) {
    const { user, role, loading } = useAuth()
    if (loading) return <Loading />
    if (!user) return <Navigate to="/login" replace />
    //TODO 1: if rules does not include role, return <p>This page if for {roles.join(' or ')} accounts.</p>
    //Hint: roles.includes(role)
    if (roles && !roles.includes(role)) {
        return <p>This page is for {roles.join(' or ')} accounts.</p>
    }
    return <Outlet />
}

export default RoleRoute