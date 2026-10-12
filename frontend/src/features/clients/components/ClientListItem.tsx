"use client"
import {IProfile} from "@/features/profile";

export interface IClientListItemProps {
	profile: IProfile,
	onClick?: (profile: IProfile | null) => void,
}

export function ClientListItem({profile, onClick}: IClientListItemProps) {
	return (
		<div
			className="w-full flex items-center bg-card cursor-pointer rounded-xl p-4 gap-2"
			onClick={(e) => {
				e.preventDefault();
				onClick?.(profile)
			}}
		>
			<div className="size-16">
				<img
					src="/assets/images/circle-user-round.svg"
					alt="user-logo"
					className="size-full"
				/>
			</div>
			<div className="flex flex-col items-start justify-center ">
				<span className="font-bold text-lg">{profile.full_name}</span>
				<span className="">{profile.email}</span>
			</div>
		</div>
	)
}
