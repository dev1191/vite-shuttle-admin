import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUserStore } from "@/stores/modules/user.store";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);



/**
 * Convert ISO string array from backend to Dayjs[]
 * @param dates string[] | null
 */
export function parseDateRange(dates?: string[] | null): Dayjs[] {
    if (!Array.isArray(dates)) return []
    return dates.map(d => (d ? dayjs(d) : dayjs()))
}


/**
 * Convert Dayjs[] to backend object { start_date, end_date }
 * @param dates Dayjs[]
 */
export function serializeDateRange(dates: Dayjs[]) {
    if (!Array.isArray(dates) || dates.length < 2) {
        return { start_date: null, end_date: null }
    }

    const [start, end] = dates
    return {
        start_date: dayjs.isDayjs(start) ? start.toISOString() : null,
        end_date: dayjs.isDayjs(end) ? end.toISOString() : null,
    }
}

/**
 * Format date based on user's timezone from store
 * @param {string|Date} date
 * @param {object} [options]
 * @param {string} [options.format] - Custom format
 * @param {boolean} [options.withRelative=false] - Include "time ago"
 */
export function formatDate(date: string | Date, options: any = {}) {
    if (!date) return "";
    const { appSetting } = useUserStore();
    const DEFAULT_FORMAT = `${appSetting.date_format} ${appSetting.time_format} `;
    const { format = DEFAULT_FORMAT, withRelative = false } = options;

    const tz = appSetting?.timezone || "UTC";

    const d = dayjs(date).tz(tz);
    const formatted = d.format(format);
    const relative = withRelative ? ` • ${d.fromNow()}` : "";

    return formatted + relative;
}





