import React from 'react'
import { createRoot } from 'react-dom/client'
import PortFolio from './App.jsx'
import BurgerMenu from './components/BurgerMenu.jsx'

createRoot(document.getElementById('root')).render(
  <PortFolio />,
  <BurgerMenu />
)
