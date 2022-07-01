import { LocalStorageAdapter } from './local-storage-adapter'
import faker from 'faker'
import 'jest-localstorage-mock'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should call localStorage.setItem with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should call localStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = mockAccountModel()
    jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value))
    const account = sut.get(key)
    expect(localStorage.getItem).toHaveBeenCalledWith(key)
    expect(account).toEqual(value)
  })
})
