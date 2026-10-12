"use client"
import {useTranslation} from "@/i18n";
import {AppHeader, IconButton, LabeledInput, LoadingSVG} from "@/shared/components";
import {Button} from "@/shared/components/ui";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	type TResetPasswordSchema,
	useResetPasswordMutation,
	useResetPasswordSchema,
	useResetPasswordScreenContext
} from "@/features/authentication";
import {ArrowLeft, X} from "lucide-react";
import {useRouter} from "next/navigation";

export function ResetPasswordWidget() {
	const {t} = useTranslation("widgets.auth.ResetPasswordWidget")
	const schema = useResetPasswordSchema()
	const mutation = useResetPasswordMutation()
	const {setFormData, setCurrentWidget} = useResetPasswordScreenContext()
	const router = useRouter()

	const {
		handleSubmit,
		formState: {errors, isSubmitting},
		control,
	} = useForm<TResetPasswordSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: ""
		}
	});

	async function onSubmit(payload: TResetPasswordSchema) {
		await mutation.mutateAsync({
			email: payload.email,
		}, {
			onSuccess: (data) => {
				setFormData("email", payload.email)
				setCurrentWidget("otp")
			}
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit, (errors) => {
				// console.log("Validation errors:", errors);
			})}
			className="size-full flex flex-col items-center justify-between bg-background px-4 py-8 gap-8"
		>
			<AppHeader
				leftAction={
					<IconButton
						aria-label={"back"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							router.replace("/auth/login")
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
						{t("Password recovery")}
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

			<div className="size-full flex flex-col items-center justify-between">
				<Controller
					control={control}
					name="email"
					render={({field}) => (
						<LabeledInput
							name="email"
							label={t("EMAIL")}
							placeholder="example@gmail.com"
							value={field.value}
							onChange={field.onChange}
							error={errors.email?.message}
						/>
					)}
				/>

				<Button
					type="submit"
					className="w-full h-12 bg-button rounded-full mt-8"
					disabled={isSubmitting}
				>
					{isSubmitting && <LoadingSVG/>}
					<span>{t("Send code")}</span>
				</Button>
			</div>
		</form>
	)
}
