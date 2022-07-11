import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { makeLogin as MakeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignup as MakeSignup } from '@/main/factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '../adapters/current-account-adapter'
import { makeSurveyList as MakeSurveyList } from '@/main/factories/pages'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MakeLogin />} />
          <Route path="/signup" element={<MakeSignup />} />
          <Route path="/" element={<MakeSurveyList />} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
