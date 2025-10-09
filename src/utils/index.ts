import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUserStore } from "@/stores/modules/user.store";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const DEFAULT_FORMAT = "YYYY-MM-DD hh:mm A";

/**
 * Format date based on user's timezone from store
 * @param {string|Date} date
 * @param {object} [options]
 * @param {string} [options.format] - Custom format
 * @param {boolean} [options.withRelative=false] - Include "time ago"
 */
export function formatDate(date: string | Date, options: any = {}) {
    if (!date) return "";

    const { format = DEFAULT_FORMAT, withRelative = false } = options;
    const { generalSetting } = useUserStore();
    const tz = generalSetting?.timezone || "UTC";

    const d = dayjs(date).tz(tz);
    const formatted = d.format(format);
    const relative = withRelative ? ` • ${d.fromNow()}` : "";

    return formatted + relative;
}




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