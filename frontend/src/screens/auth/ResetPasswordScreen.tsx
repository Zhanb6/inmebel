"use client"
import {ResetPasswordWidget, SetNewPasswordWidget} from "@/widgets/auth";
import {useResetPasswordScreenContext} from "@/features/authentication/providers";
import {ConfirmResetPasswordWidget} from "@/widgets/auth/ConfirmResetPasswordWidget";


export default function ResetPasswordScreen() {
	const {currentWidget} = useResetPasswordScreenContext()

	return (
		<>
			{currentWidget === "email" && <ResetPasswordWidget/>}
			{currentWidget === "otp" && <ConfirmResetPasswordWidget/>}
			{currentWidget === "password" && <SetNewPasswordWidget/>}
		</>
	)
}
