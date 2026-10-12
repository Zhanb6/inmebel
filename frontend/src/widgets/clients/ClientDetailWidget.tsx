import {Conditional, IconButton} from "@/shared/components";
import {cn} from "@/shared";
import {ArrowLeft} from "lucide-react";
import {
	ClientProfileCard,
	ClientProfileCardSkeleton,
	StudentDetailsCard,
	StudentDetailsCardSkeleton,
	useClientsScreenContext
} from "@/features/clients";
import {
	ConclusionCard,
	ConclusionCardSkeleton,
	FormsCard,
	FormsCardSkeleton,
	ProgressCard,
	ProgressCardSkeleton,
	useConclusionsQuery,
	useFormsQuery,
	useLessonsQuery,
	useProfileQuery,
	useStudentDetailsQuery
} from "@/features/profile";

export function ClientDetailWidget() {
	const {setActiveWidget, selectedClient, setSelectedClient,} = useClientsScreenContext()

	const profileQuery = useProfileQuery()
	const studentDetailsQuery = useStudentDetailsQuery()
	const formsQuery = useFormsQuery()
	const lessonsQuery = useLessonsQuery()
	const conclusionsQuery = useConclusionsQuery()

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
					{selectedClient?.full_name}
				</div>
			</div>
			<div className="flex flex-col gap-4 pb-4">
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

		</div>
	)
}
