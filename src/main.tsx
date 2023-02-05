import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const node = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(node).render(
  // TODO add <React.StrictMode>
  <App />
)
