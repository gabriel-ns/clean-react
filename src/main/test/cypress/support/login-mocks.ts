import * as Helper from './http-mocks'
import faker from 'faker'

export const mockInvalidCredentialsError = (): void => Helper.mockInvalidCredentialsError(/login/)

export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/login/, 'POST')

export const mockOk = (response?: any): void => Helper.mockOk(/login/, 'POST', response || { accessToken: faker.datatype.uuid(), name: faker.name.findName() })
