import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

const makeSut = (minLength: number, fieldName = faker.database.column()): MinLengthValidation => new MinLengthValidation(fieldName, minLength)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const sut = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(3))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value length equals validation length', () => {
    const sut = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })

  test('Should return falsy if value length is greater validation length', () => {
    const sut = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(6))
    expect(error).toBeFalsy()
  })

  test('Should save the correct fieldName', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(5, fieldName)
    expect(sut.fieldName).toBe(fieldName)
  })
})
