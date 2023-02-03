import React from 'react'
import ReactDOM from 'react-dom/client'
import WelcomeForm from './components/WelcomeForm'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WelcomeForm />
  </React.StrictMode>,
)
