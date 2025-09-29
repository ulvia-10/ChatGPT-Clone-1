import { Outlet, useNavigate } from 'react-router-dom'
import './DashboardLayout.css'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import ChatList from '../chatList/ChatList'

const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth()

    const navigate = useNavigate()
    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-in')
        }
    }, [isLoaded, userId, navigate])

    if (!isLoaded) {
        return "loading..."
    }

    return (
        <div className="dashboard-layout">
            <div className='menu'><ChatList /></div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout