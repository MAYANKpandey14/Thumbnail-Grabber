export interface PasswordValidationResult {
    valid: boolean;
    rules: {
        minLength: boolean;
        hasUpper: boolean;
        hasLower: boolean;
        hasDigit: boolean;
        hasSpecial: boolean;
        noSurroundingSpaces: boolean;
    };
}

export const validatePassword = (password: string): PasswordValidationResult => {
    const minLength = 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+[\]{};'\\/`~]/.test(password); // Broad set of special chars
    const noSurroundingSpaces = password.trim() === password && password.length > 0;
    const isMinLength = password.length >= minLength;

    return {
        valid: isMinLength && hasUpper && hasLower && hasDigit && hasSpecial && noSurroundingSpaces,
        rules: {
            minLength: isMinLength,
            hasUpper,
            hasLower,
            hasDigit,
            hasSpecial,
            noSurroundingSpaces,
        },
    };
};

export const PASSWORD_REQUIREMENTS = [
    { key: 'minLength', label: 'At least 12 characters' },
    { key: 'hasUpper', label: 'At least one uppercase letter (A-Z)' },
    { key: 'hasLower', label: 'At least one lowercase letter (a-z)' },
    { key: 'hasDigit', label: 'At least one number (0-9)' },
    { key: 'hasSpecial', label: 'At least one special character' },
    { key: 'noSurroundingSpaces', label: 'No leading or trailing spaces' }
] as const;
