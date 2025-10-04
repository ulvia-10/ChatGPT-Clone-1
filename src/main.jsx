import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
   // eslint-disable-next-line react/jsx-no-undef
   <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
