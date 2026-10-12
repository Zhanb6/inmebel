/*
 * Copyright (c) 2025. Sayat Raykul
 */

import NextAuth, {CredentialsSignin, IUser} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {NextResponse} from "next/server";
import { skipCSRFCheck } from "@auth/core"; // for local production
import axios from "axios";
import { env, serverApi } from "./shared/server";
import setCookieParser from "set-cookie-parser";


class InvalidLoginError extends CredentialsSignin {
	static type = "InvalidLoginError";

	constructor(message: string) {
		super(message);
		this.code = message;
	}
}

const apiClient = axios.create({
	baseURL: env.API_URL,
	headers: {"Content-Type": "application/json"},
});

// Глобальные переменные для синхронизации обновления токенов
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const {handlers, signIn, signOut, auth} = NextAuth({
// skipCSRFCheck, // for local production
providers: [
  Credentials({
    id: "register",
    name: "Register",
    credentials: {
      iin: {},
      name: {},
      phone: {},
      addres: {},
      password: {},
      password_confirmation: {},
      workshop_name: { required: false },
			workshop_bik: { required: false },
			workshop_bank: { required: false },
			workshop_director_name: { required: false },
			workshop_director_iic: { required: false },
			workshop_bc: { required: false },
			workshop_city: { required: false },
    },
async authorize(credentials) {
	try {
		console.log("Registration credentials received:", credentials);
		
		const [{getRegisterSchema}, {registerUser, registerWorkshop}] = await Promise.all([
			import("@/features/authentication/lib/zodServer"),
			import("@/features/authentication/services/server"),
		]);
		
		const registerSchema = await getRegisterSchema();
		console.log("Validating with schema...");
		
		const {success, data, error} = await registerSchema.safeParseAsync(credentials);
		
		if (!success) {
			console.error("Validation error:", error.errors);
			throw new InvalidLoginError(error.errors[0]?.message || "Validation failed");
		}
		
		console.log("Validation successful, data:", data);
		const hasWorkshopName = data.workshop_name && data.workshop_name.trim() !== "";
		
		let result;
		if (hasWorkshopName) {
			console.log("Registering workshop...");
			result = await registerWorkshop(data);
		} else {
			console.log("Registering user...");
			result = await registerUser(data);
		}
		
		console.log("Registration result:", result);
		
		if (!result.success) {
			throw new InvalidLoginError(result.error || "Registration failed");
		}
		
		return result.data;
	} catch (error) {
		console.error("Registration error in authorize:", error);
		throw error;
	}
},
  }),
		Credentials({
			id: "login",
			name: "Login",
			credentials: {
				phone: {},
				password: {},
				remember: {},
			},
			async authorize(credentials, _) {
				const handledCredentials = {
					...credentials,
					remember: credentials.remember === "true"
				}

				const [{getLoginSchema}, ] = await Promise.all([
					import("@/features/authentication/lib/zodServer"),
				]);

				const loginSchema = await getLoginSchema();
				const {success, data, error} = await loginSchema.safeParseAsync(handledCredentials);
				
				if (!success) {
					throw new InvalidLoginError(error.errors[0]?.message || "");
				}

				const result = await apiClient.post("/api/login/", data);
				
				console.log({ result });
				if (result.status !== 200) {
					throw new InvalidLoginError(result.statusText);
				}

				const parsedCookies = setCookieParser.parse(result.headers["set-cookie"] ?? '');
				const refresh_token = parsedCookies.find(c => c.name === "refresh_token");

				console.log({parsedCookies})

				return {
					id: String(result.data.user.id),
					name: result.data.user.name,
					email: result.data.user.name,
					loginOut: result.data,
					access_token: result.data.access_token,
					refresh_token,
				};
			},
		}),
	],

	trustHost: true,
	session: {
		strategy: "jwt",
	},

	callbacks: {
		async jwt({ token, user, trigger }) {
			const anyToken = token as any;
			
			if (user) {
				console.log({user})
				anyToken.user = user;
				anyToken.access = (user as any).access_token;
				anyToken.loginOut = (user as any).loginOut;
				const refreshToken = (user as any).refresh_token;
if (refreshToken && refreshToken.value) {
  anyToken.refresh = refreshToken.value;
} else if (refreshToken) {
  // Если refresh_token уже строка
  anyToken.refresh = refreshToken;
} else {
  // Для регистрации - нет refresh token
  anyToken.refresh = null;
}
			}
		


			if (anyToken.access && anyToken.access.expires_at && anyToken.refresh) {
				try {
					const currentTimeSeconds = Math.floor(Date.now() / 1000);
					const expiresAt = new Date(anyToken.access.expires_at).getTime() / 1000;
					const isExpired = expiresAt <= currentTimeSeconds + 50;
					
					if (isExpired) {

						
						
						// Если уже идет обновление, ждем его завершения
						if (isRefreshing && refreshPromise) {

							const result = await refreshPromise;
							// Копируем обновленные токены из результата
							if (result) {
								anyToken.access = result.access;
								anyToken.refresh = result.refresh;
							}
							return anyToken;
						}

						// Начинаем процесс обновления
						isRefreshing = true;
						refreshPromise = (async () => {
							try {
								const refreshResponse = await apiClient.post(('/api/refresh-token'), null, {
									headers: {
										Cookie: `refresh_token=${anyToken.refresh}`
									}
								});
								
								
								if (refreshResponse.status === 200) {
									
									const parsedCookies = setCookieParser.parse(refreshResponse.headers["set-cookie"] ?? '');
									const refresh_token = parsedCookies.find(c => c.name === "refresh_token");
									
									const refreshTokenValue = refresh_token?.value;
									

									// Возвращаем обновленные токены
									return {
										access: {
											token: refreshResponse.data.access_token.token,
											expires_at: refreshResponse.data.access_token.expires_at
										},
										refresh: refreshTokenValue
									};
								} else {
									console.log("refresh token failed");
									return null;
								}
							} catch (error) {
								console.error("⚠️ Error refreshing token:", error);
								
								// Если получили 422, refresh token невалиден - нужен перелогин
								if (axios.isAxiosError(error) && error.response?.status === 422) {
									console.log("Refresh token invalid - clearing tokens");
									return null;
								}
								return null;
							} finally {
								// Всегда сбрасываем флаг
								isRefreshing = false;
							}
						})();

						const result = await refreshPromise;
						refreshPromise = null;
						
						if (result) {
							// Обновляем токены
							anyToken.access = result.access;
							anyToken.refresh = result.refresh;
						} else {
							// Если обновление не удалось, очищаем токены
							anyToken.access = null;
							anyToken.refresh = null;
							return null;
						}
					}
				} catch (error) {
					console.error("⚠️ Error in jwt callback:", error);
					return null;
				}
			}
			
			return anyToken;
		},

		async session({session, token}) {
			const anyToken = token as any;
			const anySession = session as any;
			
			if (anyToken.user) {
				anySession.access = anyToken.access;
				anySession.refresh = anyToken.refresh
				anySession.loginOut = anyToken.loginOut;
				session.user = {
					...session.user,
					id: anyToken.user.id ?? "",
					name: anyToken.user.name ?? "",
					email: anyToken.user.email ?? "",
					emailVerified: new Date()
				};
			}
			
			return session;
		},

async authorized({request, auth}) {
	const {pathname} = request.nextUrl;

	const isPublic = pathname.startsWith("/auth");
	const isProtected = pathname.startsWith("/client/request");
	const isHomePage = pathname === "/";
	const userRole = (auth as any)?.loginOut?.role;
	
	// Если пользователь только что зарегистрировался (нет токенов), не перенаправляем
	const isNewUser = (auth as any)?.user?.isNewUser || !(auth as any)?.access;
	
	if (auth && isPublic && !isNewUser) {
		return NextResponse.redirect(new URL("/", request.url));
	}
	
	if (auth && userRole === 'workshop' && isProtected) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
},
	},

	pages: {
		signIn: "/login",
		error: "/login",
	},
});