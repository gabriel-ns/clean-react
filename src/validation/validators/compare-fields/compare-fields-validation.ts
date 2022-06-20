import { InvalidFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly fieldName: string,
    private readonly valueToCompare) {}

  validate (value: string): Error {
    return new InvalidFieldError()
  }
}
