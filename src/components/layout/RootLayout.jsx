import { Link, Outlet } from 'react-router-dom'
import './RootLayout.css'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <div className="rootlayout">
                <header>
                    <Link to="/" className='logo'>
                        <img src="/logo.png" alt="ChatGPT Clone" />
                        <span className='cuekin'>Cuekin AI</span>
                    </Link>
                    <div className='user'>
                        <SignedIn>
                            <UserButton />
                        </SignedIn></div>
                </header>
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </ClerkProvider>

    )
}

export default RootLayout