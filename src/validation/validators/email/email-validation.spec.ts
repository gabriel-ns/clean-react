import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from './email-validation'
import faker from 'faker'

const makeSut = (fieldName: string = faker.database.column()): EmailValidation => new EmailValidation(fieldName)

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })

  test('Should return falsy if email is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })

  test('Should save the correct fieldName', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    expect(sut.fieldName).toBe(fieldName)
  })
})
