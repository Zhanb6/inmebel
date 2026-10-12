/*
 * Copyright (c) 2025. Sayat Raykul
 */

// shared/lib/query.ts
type QueryParams = Record<string, unknown>;

export const buildQueryParams = (params: QueryParams): string => {
	const query = Object.entries(params)
	.filter(([_, value]) => value !== undefined && value !== null)
	.map(
		([key, value]) =>
			`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
	)
	.join("&");
	return query ? `?${query}` : "";
};
