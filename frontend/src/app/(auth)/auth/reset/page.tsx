/*
 * Copyright (c) 2025. Sayat Raykul
 */
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen";
import {ResetPasswordScreenProvider} from "@/features/authentication";

export default function Page() {
	return <ResetPasswordScreenProvider>
		<ResetPasswordScreen/>
	</ResetPasswordScreenProvider>
}
