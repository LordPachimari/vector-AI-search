import PartykitProvider from "~/providers/partykit/partykit";
import { cookies } from "next/headers";
import GlobalReplicacheProvider from "~/providers/replicache/global";
interface HomeLayoutProps {
	children: React.ReactNode;
}

export default async function MainLayout({ children }: HomeLayoutProps) {
	const userID = cookies().get("user_id")?.value;

	return (
		<PartykitProvider userID={userID}>
			<GlobalReplicacheProvider userID={userID}>
				{children}
			</GlobalReplicacheProvider>
		</PartykitProvider>
	);
}
