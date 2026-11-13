/**
 * Utility functions to format dates globally to the NYSE timezone (America/New_York)
 */

import { getLocale } from "../context/LanguageContext";

export const NYSE_TIMEZONE = "America/New_York";

/**
 * Formats a Date object or date string into a localized date string in NYSE time.
 * @param {Date|string} date 
 * @param {Intl.DateTimeFormatOptions} options 
 * @returns {string}
 */
export function formatNYSEDate(date, options = {}) {
    if (!date) return "-";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString(getLocale(), {
            timeZone: NYSE_TIMEZONE,
            ...options,
        });
    } catch (err) {
        return "-";
    }
}

/**
 * Formats a Date object or date string into a localized time string in NYSE time.
 * @param {Date|string} date 
 * @param {Intl.DateTimeFormatOptions} options 
 * @returns {string}
 */
export function formatNYSETime(date, options = {}) {
    if (!date) return "-";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleTimeString(getLocale(), {
            timeZone: NYSE_TIMEZONE,
            ...options,
        });
    } catch (err) {
        return "-";
    }
}

/**
 * Formats a Date object or date string into a localized date-time string in NYSE time.
 * @param {Date|string} date 
 * @param {Intl.DateTimeFormatOptions} options 
 * @returns {string}
 */
export function formatNYSEDateTime(date, options = {}) {
    if (!date) return "-";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleString(getLocale(), {
            timeZone: NYSE_TIMEZONE,
            ...options,
        });
    } catch (err) {
        return "-";
    }
}
