import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";

/**
 * Форматирует объект Date или строку даты по заданному шаблону, используя библиотеку date-fns.
 *
 * @param date Объект Date или строка даты для форматирования.
 * @param formatString Шаблон форматирования (например, "dd.MM.yyyy HH:mm:ss").
 * @returns Отформатированная строка даты.
 *
 * @example
 * // Использование:
 * const myDate = new Date();
 * const formattedDate = formatDate(myDate, "dd.MM.yyyy HH:mm:ss");
 * console.log(formattedDate);
 *
 * const dateString = "2023-10-27T15:30:00Z";
 * const formattedStringDate = formatDate(dateString, "dd MMMM yyyy");
 * console.log(formattedStringDate); // "27 октября 2023"
 */
export function formatDate(
	date: Date | string,
	formatString: string = "dd.MM.yyyy HH:mm:ss",
): string {
	let dateObj: Date;

	if (typeof date === "string") {
		// Преобразуем строку в объект Date.
		dateObj = new Date(date);
	} else {
		// Если это уже объект Date, используем его напрямую.
		dateObj = date;
	}

	return format(dateObj, formatString, {locale: ru});
}

export function parseDateFromIso(dateIsoString: string): Date {
	const iso = parseISO(dateIsoString);
	const local = new Date(
		iso.getFullYear(),
		iso.getMonth(),
		iso.getDate(),
		0, 0, 0, 0
	);
	return local;
}

export function combineDateAndTime(dateIsoString: string, time?: string): Date {
	const base = parseDateFromIso(dateIsoString);
	if (!time) return base;
	const [hh, mm] = time.split(":").map(n => Number(n));
	const d = new Date(base);
	d.setHours(hh || 0, mm || 0, 0, 0);
	return d;
}
