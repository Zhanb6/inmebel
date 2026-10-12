import {Conditional, IconButton, LabeledInput, LabeledPasswordInput, LoadingSVG} from "@/shared/components";
import {cn} from "@/shared";
import {useTranslation} from "@/i18n";
import {ArrowLeft, SaveIcon} from "lucide-react";
import {
	FormCard,
	FormCardSkeleton,
	type TCreateClientSchema,
	useClientsScreenContext,
	useCreateClientMutation,
	useCreateClientSchema
} from "@/features/clients";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/shared/components/ui";
import {useFormsQuery} from "@/features/profile";

export function CreateClientWidget() {
	const {t} = useTranslation("widgets.clients.CreateClientWidget")
	const {setActiveWidget} = useClientsScreenContext()

	const query = useFormsQuery()
	const schema = useCreateClientSchema()
	const editMutation = useCreateClientMutation()
	const {
		handleSubmit,
		formState: {errors, isSubmitting},
		control,
	} = useForm<TCreateClientSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstname: "",
			lastname: "",
			speechTherapyConclusion: "",
			email: "",
			password: "",
			confirm: "",
		}
	});

	async function onSubmit(loginData: TCreateClientSchema) {
		await editMutation.mutateAsync({
			firstname: loginData.firstname,
			lastname: loginData.lastname,
			speech_therapy_conclusion: loginData.speechTherapyConclusion,
			email: loginData.email,
			password: loginData.password,
		}, {
			onSuccess: (data) => {
				setActiveWidget("list");
			}
		})
	}


	return (
		<div className="w-full flex flex-col gap-4">
			<div
				className={cn(
					"w-full h-12 shrink-0 flex items-center justify-between gap-2",
				)}
			>
				<IconButton
					aria-label={"back"}
					variant="secondary"
					className="size-9"
					onClick={(event) => {
						event.preventDefault()
						setActiveWidget("list")
					}}
					icon={
						<ArrowLeft
							className="size-6"
						/>
					}
				/>
				<div className="w-full flex items-center text-xl font-semibold truncate">
					{t("Create a client")}
				</div>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit, (errors) => {
					// console.log("Validation errors:", errors);
				})}
				className="size-full rounded-t-2xl flex flex-col items-center justify-between bg-background"
			>
				<div className="size-full flex flex-col items-center justify-between gap-2">
					<div className="size-full flex flex-col items-center gap-2">
						<h3 className="w-full text-start font-bold">{t("Client data")}</h3>
						<Controller
							control={control}
							name="firstname"
							render={({field}) => (
								<LabeledInput
									name="firstname"
									label={t("Firstname")}
									placeholder={t("Firstname")}
									value={field.value}
									onChange={field.onChange}
									error={errors.firstname?.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="lastname"
							render={({field}) => (
								<LabeledInput
									name="lastname"
									label={t("Lastname")}
									placeholder={t("Lastname")}
									value={field.value}
									onChange={field.onChange}
									error={errors.lastname?.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="speechTherapyConclusion"
							render={({field}) => (
								<LabeledInput
									name="speechTherapyConclusion"
									label={t("Speech-Language Therapy conclusion")}
									placeholder={t("Speech-Language Therapy conclusion")}
									value={field.value}
									onChange={field.onChange}
									error={errors.speechTherapyConclusion?.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="email"
							render={({field}) => (
								<LabeledInput
									name="email"
									label={t("Email")}
									placeholder="example@gmail.com"
									value={field.value}
									onChange={field.onChange}
									error={errors.email?.message}
								/>
							)}
						/>

						<h3 className="w-full text-start font-bold">{t("Mandatory forms")}</h3>

						<div className="w-full flex flex-col gap-4">
							<Conditional
								query={query}
								skeleton={
									Array.from({length: 3}).map((_, index) => (
										<FormCardSkeleton key={`form-skeleton-${index}`}/>
									))
								}
							>
								{query.data?.results.map((item, index) => (
									<FormCard key={`form-${item.id}-${index}`} item={item}/>
								))}
							</Conditional>
						</div>

						<h3 className="w-full text-start font-bold">{t("Security")}</h3>
						<Controller
							control={control}
							name="password"
							render={({field}) => (
								<LabeledPasswordInput
									name="password"
									label={t("Password")}
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
									label={t("Confirm your password")}
									placeholder={t("Confirm password")}
									value={field.value}
									onChange={field.onChange}
									error={errors.confirm?.message}
								/>
							)}
						/>
					</div>
					<Button
						type="submit"
						className="w-full flex items-center h-12 bg-button rounded-full mt-8"
						disabled={isSubmitting}
					>
						{isSubmitting && <LoadingSVG/>}
						<SaveIcon/>
						<span>
							{t("Save")}
						</span>
					</Button>
				</div>
			</form>
		</div>
	)
}
