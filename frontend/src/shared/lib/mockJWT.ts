/*
 * Copyright (c) 2025. Sayat Raykul
 */

// shared/lib/mockJwt.ts
function base64UrlEncode(obj: object) {
	return Buffer.from(JSON.stringify(obj))
	.toString("base64")
	.replace(/=/g, "")
	.replace(/\+/g, "-")
	.replace(/\//g, "_");
}

function randomString(length: number) {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export function generateMockJwt({
	sub = "1",
	name = "Mock User",
	email = "mock@example.com",
	expiresInSec = 3600,
}: {
	sub?: string;
	name?: string;
	email?: string;
	expiresInSec?: number;
} = {}) {
	const header = {alg: "HS256", typ: "JWT"};
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + expiresInSec;

	const payload = {sub, name, email, iat, exp};

	const encodedHeader = base64UrlEncode(header);
	const encodedPayload = base64UrlEncode(payload);
	const signature = randomString(43); // длина примерно как у HS256 сигнатуры

	return `${encodedHeader}.${encodedPayload}.${signature}`;
}