import { cookies } from "next/headers";
import ProfilePage from "./components/profile-page";

export default function Page() {
	const userID = cookies().get("user_id")?.value!
	return (
		<ProfilePage userID={userID}/>
	);
}
