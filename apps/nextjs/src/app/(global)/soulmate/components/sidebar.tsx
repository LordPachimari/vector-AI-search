"use client";

import type { Chat } from "@soulmate/validators";
import { Menu } from "lucide-react";
import { useState } from "react";
import ImagePlaceholder from "~/components/image-placeholder";
import { ReplicacheStore } from "~/replicache-store";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Button } from "~/ui/button";
import { cn } from "~/utils/cn";
import { useReplicache } from "~/zustand/replicache";

interface SidebarProps {
	children: React.ReactNode;
	setChatID: (id: string | null) => void;
	setAI: (id: string | null) => void;
	userID: string | null | undefined;
	chatID: string | null | undefined;
}
const Sidebar = ({
	children,
	setChatID,
	userID,
	chatID,
	setAI,
}: SidebarProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const chatRep = useReplicache((state) => state.chatRep);
	const chats = ReplicacheStore.scan<Chat>(chatRep, "chat");

	return (
		<div className="w-full h-full flex flex-col inset-0 ">
			<nav
				className={cn(
					"flex flex-col items-center min-h-screen pt-20 fixed z-30 bg-background h-full w-0 md:w-60  overflow-hidden md:border-r-[1px]  backdrop-blur-3xl transition-all duration-200 ease-in-out ",
					{ "w-60": sidebarOpen },
				)}
			>
				<Button
					className="w-[10rem]"
					onClick={() => {
						setChatID(null);
						setAI(null);
					}}
				>
					Find soulmate!
				</Button>
				<ul className="justify-center items-center flex w-full flex-col gap-4 px-2 py-6">
					{chats.map((c) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<li
							key={c.id}
							className={cn(
								"flex h-10 w-full items-center gap-3 rounded-md px-2 cursor-pointer hover:bg-blue-3 ",
							)}
							onClick={() => {
								if (c.isAI) {
									setChatID(c.id);
									setAI("true");
								} else {
									setChatID(c.id);
									setAI(null);
								}
							}}
						>
							<div className="flex justify-center ">
								<Avatar className="w-[2rem] h-[2rem]">
									<AvatarImage
										src={
											c.chatter1ID !== userID
												? c.chatter1?.avatarURL ?? undefined
												: c.chatter2?.avatarURL ?? undefined
										}
										alt="avatar image"
									/>
									<AvatarFallback className="bg-blue-4 hover:bg-blue-5">
										<ImagePlaceholder />
									</AvatarFallback>
								</Avatar>
								{c.isAI && "(AI)"}
							</div>
							<span
								className={cn(
									"w-[350px] text-blue-11",

									chatID === c.id ? "text-blue-9" : "text-slate-10",
								)}
							>
								{`${
									c.chatter1ID !== userID
										? c.chatter1?.fullName
										: c.chatter2?.fullName
								} ${c.isAI ? "(AI)" : ""}`}
							</span>
						</li>
					))}
				</ul>
			</nav>

			<Button
				size={"icon"}
				className={cn("md:hidden fixed top-28 left-5 z-30")}
				onClick={() => setSidebarOpen((prev) => !prev)}
			>
				<Menu />
			</Button>
			{children}
		</div>
	);
};

export default Sidebar;
