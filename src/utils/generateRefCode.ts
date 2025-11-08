/**
 * Generates a unique 16-character referral code
 * Uses only letters (A-Z, a-z) - no numbers or special characters
 */
export const generateRefCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let code = ''
  
  for (let i = 0; i < 16; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  
  return code
}

