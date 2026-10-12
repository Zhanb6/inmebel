"use client"
import {LoginWidget, LogoAndTitleWidget} from "@/widgets/auth";

export default function LoginScreen() {
	return (
		<div
			className="size-full flex flex-col items-center justify-between"
		>
			<div className="p-4">
				<LogoAndTitleWidget/>
			</div>

			<LoginWidget/>
		</div>
	)
}
