import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import PrivateRoute from './private-route'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
}

const makeSut = (): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const sut = render(
    <Router navigator={ history } location={ history.location }>
      <Routes>
        <Route path="/" element={ <PrivateRoute />}/>
      </Routes>
    </Router>
  )
  return {
    sut,
    history
  }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/login')
  })
})
