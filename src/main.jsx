import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PortFolio from './App.jsx'
import BurgerMenu from './BurgerMenu.jsx'

createRoot(document.getElementById('root')).render(
  <PortFolio />,
  <BurgerMenu />
)
