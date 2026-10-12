import {
	ClientProfileCard,
	ClientProfileCardSkeleton,
	ConclusionCard,
	ConclusionCardSkeleton,
	FormsCard,
	FormsCardSkeleton,
	ProgressCard,
	ProgressCardSkeleton,
	StudentDetailsCard,
	StudentDetailsCardSkeleton,
	useConclusionsQuery,
	useFormsQuery,
	useLessonsQuery,
	useProfileQuery,
	useStudentDetailsQuery
} from "@/features/profile";
import {Conditional} from "@/shared/components";

export function CabinetWidget() {
	const profileQuery = useProfileQuery()
	const studentDetailsQuery = useStudentDetailsQuery()
	const formsQuery = useFormsQuery()
	const lessonsQuery = useLessonsQuery()
	const conclusionsQuery = useConclusionsQuery()
	return (
		<div className="flex flex-col gap-4 pb-4">
			<div className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
				{profileQuery.data?.full_name}
			</div>

			<Conditional
				queries={[profileQuery, lessonsQuery]}
				skeleton={<ClientProfileCardSkeleton/>}
			>
				<ClientProfileCard
					profile={profileQuery.data}
					lessons={lessonsQuery.data?.results ?? []}
				/>
			</Conditional>
			<Conditional
				query={studentDetailsQuery}
				skeleton={<StudentDetailsCardSkeleton/>}
			>
				<StudentDetailsCard
					student={studentDetailsQuery.data}
				/>
			</Conditional>

			<Conditional
				query={formsQuery}
				skeleton={<FormsCardSkeleton/>}
			>
				<FormsCard items={formsQuery.data?.results ?? []}/>
			</Conditional>

			<Conditional
				query={lessonsQuery}
				skeleton={<ProgressCardSkeleton/>}
			>
				<ProgressCard lessons={lessonsQuery.data?.results ?? []}/>
			</Conditional>

			<Conditional
				query={conclusionsQuery}
				skeleton={<ConclusionCardSkeleton/>}
			>
				<ConclusionCard items={conclusionsQuery.data?.results ?? []}/>
			</Conditional>
		</div>
	)
}
