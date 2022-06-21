import React, { useState } from 'react'
import Styles from './signup-styles.scss'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/components/contexts/form-context'
import { Link } from 'react-router-dom'

const Signup: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    emailError: 'Campo Obrigatório',
    passwordConfirmationError: 'Campo Obrigatório',
    nameError: 'Campo Obrigatório',
    passwordError: 'Campo Obrigatório',
    mainError: ''
  })

  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state }}>
        <form data-testid='form' className={Styles.form}>
          <h2>Login</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />
          <button data-testid='submit' className={Styles.submit} disabled type="submit">Entrar</button>
          <Link to="/login" className={Styles.link}>Voltar para o login</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Signup
