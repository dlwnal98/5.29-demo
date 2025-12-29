import { BrowserRouter } from 'react-router-dom'
import Providers from '@/components/providers'
import AppRoutes from './routes'

export default function App() {


  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  )
}
