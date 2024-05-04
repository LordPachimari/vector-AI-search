import { Layout } from "./components/layout";
import { cookies } from "next/headers";

export default function Page() {
	const userID = cookies().get("user_id")?.value;
	return <Layout userID={userID} />;
}
