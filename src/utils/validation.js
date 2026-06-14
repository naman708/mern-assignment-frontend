// react-hook-form rule objects shared across forms so validation stays consistent
// with the backend (password ≥8 chars with a letter and a number; email format).

export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address',
  },
}

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
  validate: {
    hasLetter: (v) => /[a-zA-Z]/.test(v) || 'Password must contain a letter',
    hasNumber: (v) => /\d/.test(v) || 'Password must contain a number',
  },
}

export const nameRules = {
  required: 'Name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
}

// Builds a confirm-password rule that matches the value returned by getValue().
export const confirmPasswordRules = (getValue) => ({
  required: 'Please confirm your password',
  validate: (v) => v === getValue() || 'Passwords do not match',
})
