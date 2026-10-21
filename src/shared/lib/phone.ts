/** "+998 90 123 45 67" → "901234567" */
export const localDigits = (phone: string) => phone.replace(/\D/g, '').replace(/^998/, '').slice(0, 9)
/** "901234567" → "+998 90 123 45 67" */
export const fullPhone = (digits: string) => `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
