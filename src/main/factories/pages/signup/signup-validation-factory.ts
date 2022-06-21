import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeSignupValidation = (): ValidationComposite => {
  const validationComposite = new ValidationComposite([
    ...Builder.field('name').required().minLength(3).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().minLength(5).build(),
    ...Builder.field('passwordConfirmation').required().minLength(5).sameAs('password').build()
  ])
  return validationComposite
}
