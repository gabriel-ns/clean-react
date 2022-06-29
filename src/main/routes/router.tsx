import SurveyList from '@/presentation/pages/survey-list/survey-list'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { makeLogin as MakeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignup as MakeSignup } from '@/main/factories/pages/signup/signup-factory'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<MakeSignup />} />
        <Route path="/" element={<SurveyList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
