import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import SignInPage from './routes/signInPage/signInPage'
import SignUpPage from './routes/signUpPage/signUpPage'
import DashboardPage from './routes/dashboardPage/DashboardPage'
import ChatPage from './routes/chatPage/chatPage'
import ErrorPage from './components/errorPage/errorPage'
import Homepage from './routes/homepage/Homepage'



const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Homepage />
      },
      {
        path: 'sign-in/*',
        element: <SignInPage />
      },
      {
        path: 'sign-up/*',
        element: <SignUpPage />
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: 'chat/:id',
            element: <ChatPage />
          }
        ]
      }
    ]
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App