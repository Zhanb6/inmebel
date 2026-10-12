"use client"
import {useTranslation} from "@/i18n";
import {Button, InputOTP, InputOTPGroup, InputOTPSlot} from "@/shared/components/ui";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	TConfirmResetPasswordSchema,
	useConfirmResetPasswordMutation,
	useConfirmResetPasswordSchema,
	useResetPasswordMutation,
	useResetPasswordScreenContext
} from "@/features/authentication";
import React, {useEffect} from "react";
import useCountDown from 'react-countdown-hook';
import {AppHeader, IconButton, LoadingSVG} from "@/shared/components";
import {ArrowLeft, X} from "lucide-react";
import {useRouter} from "next/navigation";

const initialTime = 60 * 1000;
const interval = 1000;

function formatTimeLeft(timeLeft: number) {
	const totalSeconds = Math.floor(timeLeft / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const pad = (num: number) => String(num).padStart(2, "0");
	return `${pad(minutes)}:${pad(seconds)}`;
}


export function ConfirmResetPasswordWidget() {
	const {t} = useTranslation("widgets.auth.ConfirmResetPasswordWidget")
	const schema = useConfirmResetPasswordSchema()
	const resendMutation = useResetPasswordMutation()
	const confirmMutation = useConfirmResetPasswordMutation()
	const {formData, setCurrentWidget} = useResetPasswordScreenContext()
	const router = useRouter()
	const [timeLeft, {start, reset}] = useCountDown(initialTime, interval);
	useEffect(() => {
		start();
	}, []);

	const {
		handleSubmit,
		formState: {errors, isSubmitting},
		control,
	} = useForm<TConfirmResetPasswordSchema>({
		resolver: zodResolver(schema),
	});

	async function onResendCode() {
		if (timeLeft > 0) return

		await resendMutation.mutateAsync({
			email: formData.email
		}, {
			onSuccess: (data) => {
				reset()
			}
		})
	}

	async function onSubmit(payload: TConfirmResetPasswordSchema) {
		await confirmMutation.mutateAsync({
			email: formData.email,
			otp: payload.otp,
		}, {
			onSuccess: (data) => {
				setCurrentWidget("password")
			}
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit, (errors) => {
				// console.log("Validation errors:", errors);
			})}
			className="size-full flex flex-col items-center justify-between bg-background px-8 py-8 gap-8"
		>
			<AppHeader
				leftAction={
					<IconButton
						aria-label={"back"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							setCurrentWidget("email")
						}}
						icon={
							<ArrowLeft
								className="size-6"
							/>
						}
					/>
				}
				title={
					<h1 className="w-full text-start text-lg font-bold">
						{t("Confirmation")}
					</h1>
				}
				rightAction={
					<IconButton
						aria-label={"close"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							router.replace("/auth/login")
						}}
						icon={
							<X
								className="size-6"
							/>
						}
					/>
				}
			/>
			<div className="size-full flex flex-col items-center gap-4">
				<span className="w-full text-start">
					{t("Enter the code in the email to confirm: {{email}}", {
						email: formData.email,
					})}
				</span>
				<Controller
					control={control}
					name="otp"
					render={({field}) => (
						<>
							<InputOTP
								maxLength={4}
								value={field.value}
								onChange={field.onChange}
								inputMode="numeric"
								pattern="\d*"
							>
								<InputOTPGroup>
									<InputOTPSlot className="size-16 text-2xl font-bold" index={0}/>
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="size-16 text-2xl font-bold" index={1}/>
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="size-16 text-2xl font-bold" index={2}/>
								</InputOTPGroup>
								<InputOTPGroup>
									<InputOTPSlot className="size-16 text-2xl font-bold" index={3}/>
								</InputOTPGroup>
							</InputOTP>

							{errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
						</>
					)}
				/>
			</div>

			<div
				className="w-full flex flex-col gap-8"
			>
				<Button
					type="submit"
					className="w-full h-12 bg-button rounded-full mt-8"
					disabled={isSubmitting}
				>
					{isSubmitting && <LoadingSVG/>}
					<span>{t("Verification")}</span>
				</Button>

				<div className="flex gap-2 items-center justify-center">
					<button
						onClick={async (e) => {
							e.preventDefault();
							await onResendCode()
						}}
						disabled={timeLeft > 0}
					>{t("Send code again")}</button>
					<span>{formatTimeLeft(timeLeft)}</span>
				</div>
			</div>
		</form>
	)
}
