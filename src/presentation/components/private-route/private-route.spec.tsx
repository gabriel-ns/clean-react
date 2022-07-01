import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import PrivateRoute from './private-route'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const sut = render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <Router navigator={ history } location={ history.location }>
        <Routes>
          <Route path="/" element={ <PrivateRoute />}/>
        </Routes>
      </Router>
    </ApiContext.Provider>
  )
  return {
    sut,
    history
  }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/')
  })
})
