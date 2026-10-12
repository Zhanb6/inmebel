"use client"
import {ILesson, IProfile} from "@/features/profile";
import {useTranslation} from "@/i18n";
import {format} from "date-fns";
import {EmailSVG, LanguageSelect, PhoneSVG} from "@/shared/components";
import {Separator} from "@/shared/components/ui";
import {cn} from "@/shared";
import {signOut} from "next-auth/react";

export interface IClientProfileCardProps {
	profile?: IProfile,
	lessons: ILesson[],
}

export function ClientProfileCard({profile, lessons}: IClientProfileCardProps) {
	const {t} = useTranslation("features.profile.components.ClientProfileCard");
	return (
		<div className="w-full flex flex-col rounded-2xl border border-card p-5 gap-2">
			<div className="flex items-center gap-4">
				<div className="size-20">
					<img
						src="/assets/images/circle-user-round.svg"
						alt="user-logo"
						className="size-full"
					/>
				</div>
				<div className="flex flex-col items-start justify-center gap-2">
					<span className="font-bold text-xl">{profile?.full_name}</span>
					<span className="bg-accent text-primary-foreground text-xs px-2 py-1 rounded-full">{t("Client")}</span>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-col justify-between ">
					<span className="text-muted-foreground">{t("Registration date")}</span>
					{profile?.created_at && <span>{format(profile.created_at, "dd-MM-yyyy")}</span>}
				</div>

				<div className="flex items-center gap-2">
					<LanguageSelect/>
					{/*<ThemeSelect/>*/}
				</div>
			</div>

			<div className="flex flex-col justify-between gap-3 p-4 bg-card rounded-2xl">
				<div className="flex items-center gap-2">
					<EmailSVG className="text-icon-muted"/>
					<span>{profile?.email ?? "-"}</span>
				</div>
				<Separator className="bg-separator"/>
				<div className="flex items-center gap-2">
					<PhoneSVG className="text-icon-muted"/>
					<span>{profile?.phone ?? "-"}</span>
				</div>
			</div>
			<div className="w-full flex items-center justify-center">

			<span
				className="text-center text-destructive cursor-pointer"
				onClick={async (e) => {
					e.preventDefault();
					await signOut({
						redirect: true,
						redirectTo: "/auth/login"
					})
				}}
			>{t("Log out")}</span>
			</div>
			<ClientProfileStatus lessons={lessons}/>
		</div>
	)
}

interface IClientProfileStatusProps {
	lessons: ILesson[]
}

function ClientProfileStatus({lessons}: IClientProfileStatusProps) {
	const {t} = useTranslation("features.profile.components.ClientProfileCard");
	const remainingLessons = lessons.filter(item => !item.is_done)
	const doneLessonsLength = lessons.length - remainingLessons.length
	return (
		<div className="flex flex-col justify-between gap-2">
			<div className="flex items-center gap-2">
				<span>{t("Status:")}</span>
				<span>{t("{{remaining}} lessons left", {remaining: remainingLessons.length})}</span>
			</div>
			<div className="flex items-center gap-2">
				{Array.from({length: lessons.length}).map((item, i) => (
					<div key={`class-pill-${i}`} className={cn(
						"rounded-full h-2 w-8",
						i < doneLessonsLength ? "bg-accent" : "bg-muted"
					)}></div>
				))}
			</div>
		</div>
	);
}
