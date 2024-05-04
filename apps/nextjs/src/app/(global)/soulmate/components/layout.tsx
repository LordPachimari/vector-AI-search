"use client";
import { useQueryState } from "nuqs";
import { memo } from "react";
import Sidebar from "./sidebar";
import { SoulmateFinderChat } from "~/components/chat/soulmate-finder";
import { RealChat } from "~/components/chat/real-chat";
import { AIChat } from "~/components/chat/ai-chat";
// export interface LayoutProps {
// }

const RawLayout = ({ userID }: { userID: string | undefined | null }) => {
	const [chatID, setChatID] = useQueryState("chatID", {
		history: "push",
	});
	const [AI, setAI] = useQueryState("AI", {
		history: "push",
	});
	return (
		<Sidebar
			setChatID={setChatID}
			chatID={chatID}
			userID={userID}
			setAI={setAI}
		>
			<div className="w-full flex flex-col justify-between relative md:pl-60 pt-30 px-4 min-h-screen max-h-screen">
				<div className="h-16" />
				{!chatID && (
					<SoulmateFinderChat
						userID={userID}
						setChatID={setChatID}
						setAI={setAI}
					/>
				)}
				{chatID && AI && <AIChat userID={userID} chatID={chatID} />}
				{chatID && !AI && <RealChat userID={userID} chatID={chatID} />}
			</div>
		</Sidebar>
	);
};

export const Layout = memo(RawLayout);
