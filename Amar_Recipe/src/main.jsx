import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './context/ModalContext.jsx'
import { UserAuthProvider } from './context/UserAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </ModalProvider>
  </StrictMode>,
)
