import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login authentication={null} validation={null} />} />
        <Route path="/login" element={<Login authentication={null} validation={null}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
