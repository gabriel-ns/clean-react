import * as Helper from './http-mocks'
import faker from 'faker'

export const mockInvalidCredentialsError = (): void => Helper.mockInvalidCredentialsError(/signup/)

export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')

export const mockOk = (response?: any): void => Helper.mockOk(/signup/, 'POST', response || { accessToken: faker.datatype.uuid() })

export const mockEmailInUseError = (): void => Helper.mockForbiddenError(/signup/, 'POST')
