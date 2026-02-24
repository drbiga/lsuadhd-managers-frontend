import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/auth.tsx'
import { SessionProgressProvider } from './features/students/hooks/useSessionProgress.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SessionProgressProvider>
      <App />
    </SessionProgressProvider>
  </AuthProvider>
)
