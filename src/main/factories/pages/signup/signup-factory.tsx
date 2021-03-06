import React from 'react'
import { makeSignupValidation } from './signup-validation-factory'
import { Signup } from '@/presentation/pages'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token-factory'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'

export const makeSignup: React.FC = () => {
  return (
    <Signup
      validation={makeSignupValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
      addAccount={makeRemoteAddAccount()}
    />
  )
}
