import vine from '@vinejs/vine'

/**
 * Validates the user creation action
 */
export const registerUserValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255),
    email: vine.string().email(),
    phone: vine.string().minLength(10).maxLength(10),
    password: vine.string().confirmed(),
  })
)
