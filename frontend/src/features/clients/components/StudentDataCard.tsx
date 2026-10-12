"use client"
import {useTranslation} from "@/i18n";
import {Separator} from "@/shared/components/ui";
import {IStudent} from "@/features/profile/types/profile";
import {format} from "date-fns";
import {useClientsScreenContext} from "@/features/clients";

export interface IStudentDetailsCardProps {
	student?: IStudent,
}

export function StudentDetailsCard({student}: IStudentDetailsCardProps) {
	const {t} = useTranslation("features.profile.components.StudentDataCard");
	const {setActiveWidget} = useClientsScreenContext()
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-4">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="font-bold text-xl">{t("Student details")}</h3>
				<button
					className="bg-background text-card-foreground text-xs px-3 py-1.5 rounded-full"
					onClick={e => {
						e.preventDefault();
						setActiveWidget("update");
					}}
				>
					{t("Edit")}
				</button>
			</div>

			<div className="flex flex-col justify-between gap-3 text-sm">
				<div className="full flex items-center justify-between gap-2">
					<span className="text-card-foreground uppercase">{t("Full name")}</span>
					<span>{student?.full_name ?? "-"}</span>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<span className="text-card-foreground uppercase">{t("Registration date")}</span>
					<span>{format(student?.created_at ?? "", "dd/MM/yyyy") ?? "-"}</span>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<span className="text-card-foreground uppercase">{t("Email")}</span>
					<span>{student?.email ?? "-"}</span>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<span className="text-card-foreground uppercase">{t("Diagnosis")}</span>
					<span>{student?.diagnosis ?? "-"}</span>
				</div>
			</div>

		</div>
	)
}
