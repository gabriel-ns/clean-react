import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'
import { ValidationBuilder as sut } from './validation-builder'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = sut.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })

  test('Should return EmailValidation', () => {
    const validations = sut.field('any_field').email().build()
    expect(validations).toEqual([new EmailValidation('any_field')])
  })

  test('Should return MinLengthValidation', () => {
    const validations = sut.field('any_field').minLength(5).build()
    expect(validations).toEqual([new MinLengthValidation('any_field', 5)])
  })

  test('Should return a list of validations', () => {
    const validations = sut.field('any_field').required().email().minLength(5).build()
    expect(validations).toEqual([
      new RequiredFieldValidation('any_field'),
      new EmailValidation('any_field'),
      new MinLengthValidation('any_field', 5)
    ])
  })
})
