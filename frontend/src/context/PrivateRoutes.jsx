import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from './AuthContext'

function PrivateRoutes({ children, ...rest }) {
    const { user, logoutUser } = useContext(AuthContext)

    useEffect(() => {
        if (user && user.role !== 'admin') {
            logoutUser()
        }
    }, [user])

    if (!user) return <Navigate to="/login" />
    if (user.role !== 'admin') return <Navigate to="/login" />

    return <Outlet />
}

export default PrivateRoutes