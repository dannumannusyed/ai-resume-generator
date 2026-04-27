export const ADMIN_EMAILS = [
  'alismdaniyal@gmail.com',
  'dannumannusyed@gmail.com',
]

/**
 * Checks if a given email is in the admin list
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase())
}
