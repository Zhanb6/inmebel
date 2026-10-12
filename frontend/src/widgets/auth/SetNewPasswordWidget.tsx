"use client"
import {useTranslation} from "@/i18n";
import {Button} from "@/shared/components/ui";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	TSetNewPasswordSchema,
	useResetPasswordScreenContext,
	useSetNewPasswordMutation,
	useSetNewPasswordSchema
} from "@/features/authentication";
import {AppHeader, IconButton, LabeledPasswordInput, LoadingSVG} from "@/shared/components";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {ArrowLeft, X} from "lucide-react";

export function SetNewPasswordWidget() {
	const {t} = useTranslation("widgets.auth.SetNewPasswordWidget")
	const schema = useSetNewPasswordSchema()
	const mutation = useSetNewPasswordMutation()
	const {formData, setCurrentWidget} = useResetPasswordScreenContext()
	const router = useRouter()
	const {
		handleSubmit,
		formState: {errors, isSubmitting},
		control,
	} = useForm<TSetNewPasswordSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			password: "",
			confirm: "",
		}
	});


	async function onSubmit(payload: TSetNewPasswordSchema) {
		await mutation.mutateAsync({
			email: formData.email,
			password: payload.password,
			confirm: payload.confirm,
		}, {
			onSuccess: (data) => {
				toast.success(data.message)
				router.replace("/auth/login")
			}
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit, (errors) => {
				// console.log("Validation errors:", errors);
			})}
			className="size-full flex flex-col items-center justify-between bg-background px-4 py-8 gap-2"
		>
			<AppHeader
				leftAction={
					<IconButton
						aria-label={"back"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							setCurrentWidget("otp")
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
						{t("Setting a new password")}
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
			<div className="size-full flex flex-col items-center">
				<Controller
					control={control}
					name="password"
					render={({field}) => (
						<LabeledPasswordInput
							name="password"
							label={t("New password")}
							placeholder={t("Enter your password")}
							value={field.value}
							onChange={field.onChange}
							error={errors.password?.message}
						/>
					)}
				/>
				<Controller
					control={control}
					name="confirm"
					render={({field}) => (
						<LabeledPasswordInput
							name="confirm"
							label={t("Repeat the password")}
							placeholder={t("Enter your password")}
							value={field.value}
							onChange={field.onChange}
							error={errors.confirm?.message}
						/>
					)}
				/>
			</div>

			<Button
				type="submit"
				className="w-full h-12 bg-button rounded-full mt-8"
				disabled={isSubmitting}
			>
				{isSubmitting && <LoadingSVG/>}
				<span>{t("Save")}</span>
			</Button>
		</form>
	)
}
