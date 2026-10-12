export {auth as middleware} from "@/auth";

export const config = {
	matcher: ["/", "/auth/:path*", "/auth/login", "/client/request"],
};
