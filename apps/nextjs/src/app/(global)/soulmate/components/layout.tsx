"use client";
import { useQueryState } from "nuqs";
import { memo } from "react";
import SoulmateFinder from "~/components/chat/soulmate-finder";
import Sidebar from "./sidebar";
// export interface LayoutProps {
// }

const RawLayout = ({ userID }: { userID: string | undefined | null }) => {
	const [view, setView] = useQueryState("view", {
		history: "push",
		defaultValue: "soulmate" as const,
	});
	return (
		<Sidebar>
			<div className="w-full flex flex-col justify-between relative md:pl-60 pt-30 px-4 min-h-screen max-h-screen">
				<div className="h-16" />
				{view === "soulmate" && <SoulmateFinder userID={userID} />}
			</div>
		</Sidebar>
	);
};

export const Layout = memo(RawLayout);
