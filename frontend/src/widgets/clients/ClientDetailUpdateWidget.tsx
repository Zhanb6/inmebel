import {
	type TEditStudentDetailsSchema,
	useEditStudentDetailsMutation,
	useEditStudentDetailsSchema
} from "@/features/profile";
import {AppHeader, IconButton, LabeledCalendar, LabeledInput} from "@/shared/components";
import {ArrowLeft, SaveIcon, X} from "lucide-react";
import {useTranslation} from "@/i18n";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/shared/components/ui";
import {useClientsScreenContext} from "@/features/clients";

export function ClientDetailUpdateWidget() {
	const {t} = useTranslation("widgets.clients.ClientDetailUpdateWidget")
	const {selectedClient, setActiveWidget} = useClientsScreenContext()

	const schema = useEditStudentDetailsSchema()
	const editMutation = useEditStudentDetailsMutation()
	const {
		handleSubmit,
		formState: {errors},
		control,
	} = useForm<TEditStudentDetailsSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			birthDate: new Date(),
		}
	});

	async function onSubmit(loginData: TEditStudentDetailsSchema) {
		await editMutation.mutateAsync({
			firstname: loginData.firstname,
			lastname: loginData.lastname,
			email: loginData.email,
			birthDate: loginData.birthDate.toISOString(),
		}, {
			onSuccess: (data) => {
				setActiveWidget("detail");
			}
		})
	}


	return (
		<form
			onSubmit={handleSubmit(onSubmit, (errors) => {
				// console.log("Validation errors:", errors);
			})}
			className="size-full rounded-t-2xl flex flex-col items-center justify-between bg-background pb-4"
		>
			<AppHeader
				leftAction={
					<IconButton
						aria-label={"back"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							setActiveWidget("detail")
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
						{t("Edit: {{name}}", {name: selectedClient?.full_name})}
					</h1>
				}
				rightAction={
					<IconButton
						aria-label={"close"}
						variant="secondary"
						className="size-9"
						onClick={(event) => {
							event.preventDefault()
							setActiveWidget("detail")
						}}
						icon={
							<X
								className="size-6"
							/>
						}
					/>
				}
			/>

			<div className="size-full flex flex-col items-center justify-between gap-2">
				<div className="size-full flex flex-col items-center gap-2">
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
								error={errors.email?.message}
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
								error={errors.email?.message}
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
					<Controller
						control={control}
						name="birthDate"
						render={({field}) => (
							<LabeledCalendar
								name="birthDate"
								label={t("Date of birth")}
								value={field.value}
								onChange={field.onChange}
								error={errors.email?.message}
							/>
						)}
					/>
				</div>
				<Button
					type="submit"
					className="w-full flex items-center h-12 bg-button rounded-full mt-8">
					<SaveIcon/>
					<span>
						{t("Save")}
					</span>
				</Button>
			</div>
		</form>
	)
}
