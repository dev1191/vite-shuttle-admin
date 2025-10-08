export const toFormData = (data: Record<string, any>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // If nested object (like admin_details), stringify it
            if (typeof value === 'object' && !(value instanceof File)) {
                formData.append(key, JSON.stringify(value))
            } else {
                formData.append(key, value)
            }
        }
    })
    return formData
}

export const generateReferralCode = (length: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'
    const all = letters + digits

    // start with 2 numbers
    let code = Array.from({ length: 2 }, () => digits[Math.floor(Math.random() * digits.length)]).join('')

    // fill the rest
    code += Array.from({ length: length - 2 }, () => all[Math.floor(Math.random() * all.length)]).join('')

    // shuffle
    return code.split('').sort(() => Math.random() - 0.5).join('')
}