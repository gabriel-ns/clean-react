import React from 'react'
import { render } from '@testing-library/react'
import PrivateRoute from './private-route'
import { createMemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(
      <Router navigator={ history } location={ history.location }>
        <Routes>
          <Route path="/" element={ <PrivateRoute />}/>
        </Routes>
      </Router>
    )
    expect(history.location.pathname).toBe('/login')
  })
})
