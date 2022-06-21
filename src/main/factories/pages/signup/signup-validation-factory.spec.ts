import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'
import { makeSignupValidation } from './signup-validation-factory'

describe('SignupValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignupValidation()
    expect(composite).toEqual(new ValidationComposite([
      ...Builder.field('name').required().minLength(3).build(),
      ...Builder.field('email').required().email().build(),
      ...Builder.field('password').required().minLength(5).build(),
      ...Builder.field('passwordConfirmation').required().minLength(5).build()
    ]))
  })
})
