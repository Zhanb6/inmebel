import {useCabinetScreenContext} from "@/features/profile/providers/CabinetScreenProvider";
import {CabinetWidget, EditStudentDetailsWidget} from "@/widgets/cabinet";

export default function CabinetScreen() {
	const {activeWidget} = useCabinetScreenContext()
	return (
		<>
			{activeWidget === "cabinet" && <CabinetWidget/>}
			{activeWidget === "editStudentDetails" && <EditStudentDetailsWidget/>}
			{activeWidget === "editParentsQuestionnaire" && <EditStudentDetailsWidget/>}
		</>
	)
}
