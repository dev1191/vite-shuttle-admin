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