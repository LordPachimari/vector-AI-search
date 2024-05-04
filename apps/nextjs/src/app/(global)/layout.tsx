import PartykitProvider from "~/providers/partykit/partykit";
import { cookies } from "next/headers";
import GlobalReplicacheProvider from "~/providers/replicache/global";
import ChatReplicacheProvider from "~/providers/replicache/chat";
interface HomeLayoutProps {
	children: React.ReactNode;
}

export default async function MainLayout({ children }: HomeLayoutProps) {
	const userID = cookies().get("user_id")?.value;

	return (
		<PartykitProvider>
			<GlobalReplicacheProvider userID={userID}>
				<ChatReplicacheProvider userID={userID}>
					{children}
				</ChatReplicacheProvider>
			</GlobalReplicacheProvider>
		</PartykitProvider>
	);
}
