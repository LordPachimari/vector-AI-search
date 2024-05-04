"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "~/ui/button";
import { cn } from "~/utils/cn";

interface SidebarProps {
	children: React.ReactNode;
}
const Sidebar = ({ children }: SidebarProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return (
		<div className="w-full h-full flex flex-col inset-0 ">
			<nav
				className={cn(
					"flex flex-col items-center min-h-screen pt-20 fixed z-30 bg-background h-full w-0 md:w-60  overflow-hidden md:border-r-[1px]  backdrop-blur-3xl transition-all duration-200 ease-in-out ",
					{ "w-60": sidebarOpen },
				)}
			>
				<Button className="w-[10rem]">Find soulmate!</Button>
				{/* <ul className="justify-center items-center flex w-full flex-col gap-4 px-2 py-6"></ul> */}
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
