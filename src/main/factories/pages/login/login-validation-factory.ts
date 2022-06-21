import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeLoginValidation = (): ValidationComposite => {
  const validationComposite = new ValidationComposite([
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().minLength(5).build()
  ])
  return validationComposite
}
