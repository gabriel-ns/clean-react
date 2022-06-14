import { InvalidFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols/field-validation'

// TODO: Add interface to handle verification in Infra layer
export class EmailValidation implements FieldValidation {
  fieldName: string

  constructor (readonly field: string) {}
  validate (value: string): Error {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return emailRegex.test(value) ? null : new InvalidFieldError()
  }
}
