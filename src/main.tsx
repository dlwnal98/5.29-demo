import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { axiosInstance } from './libs/axios-Instance.ts'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
