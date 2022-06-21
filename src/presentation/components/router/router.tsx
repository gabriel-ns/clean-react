import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

type Factory = {
  MakeLogin: React.FC
  MakeSignup: React.FC
}

const Router: React.FC<Factory> = (factory: Factory) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<factory.MakeLogin />} />
        <Route path="/signup" element={<factory.MakeSignup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
