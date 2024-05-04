"use client";
import type { User } from "@soulmate/validators";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import { ReplicacheStore } from "~/replicache-store";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Badge } from "~/ui/badge";
import { Button } from "~/ui/button";
import { Card, CardContent } from "~/ui/card";
import { cn } from "~/utils/cn";
import { useReplicache } from "~/zustand/replicache";

export function ChatAnswer({
	children: message,
	loading = false,
}: {
	children: string;
	loading?: boolean;
}) {
	return (
		<div className="flex h-max w-full flex-col items-start gap-5">
			{loading ? (
				<Loader2Icon className="animate-spin text-blue-9" />
			) : (
				<div className=" h-full w-full text-lg text-white/60">
					<Markdown>{message}</Markdown>
				</div>
			)}
		</div>
	);
}

export function ChatProfileAnswer({
	loading,
	profileIDs,
}: { loading?: boolean; profileIDs: string[] }) {
	const globalRep = useReplicache((state) => state.globalRep);
	const profiles = ReplicacheStore.getByIDs<User>(globalRep, profileIDs);
	return (
		<div className="flex h-max w-full flex-col items-start gap-5">
			{loading ? (
				<Loader2Icon className="animate-spin text-blue-9" />
			) : (
				profiles?.map((p) => (
					<Card
						key={p.id}
						className={cn(
							"flex-col items-center justify-center  p-4 drop-shadow-sm dark:border transition-all duration-200 ease-in-out dark:border-slate-8",
						)}
					>
						<CardContent className="flex h-full  w-full flex-col p-0 gap-4  md:flex-row">
							<section className="flex h-full w-full  items-center justify-center md:w-[200px]">
								<Avatar className="h-20 w-20 md:h-40 md:w-40 ">
									<AvatarImage src={p.avatarURL ?? undefined} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</section>
							<section className="relative h-full w-full flex flex-col gap-2 md:w-[350px] md:p-0 ">
								<h1 className="line-clamp-2 flex-grow  text-2xl font-bold leading-none tracking-tight">
									{p.fullName ?? ""}
								</h1>
								<span className="flex">
									<p className="line-clamp-2 w-[80px] text-sm font-bold leading-none tracking-tight py-2">
										University
									</p>
									<Badge>{p.uni}</Badge>
								</span>
								<span className="flex">
									<p className="line-clamp-2 w-[80px] text-sm font-bold leading-none tracking-tight py-2">
										Hobbies
									</p>
									{p.hobbies?.map((h) => (
										<Badge key={h}>{h}</Badge>
									))}
								</span>
								<span className="flex">
									<p className="line-clamp-2 w-[80px] text-sm font-bold leading-none tracking-tight py-2">
										Skills
									</p>
									{p.skills?.map((h) => (
										<Badge key={h}>{h}</Badge>
									))}
								</span>

								<div className="flex gap-2">
									<Button>Ask more AI</Button>
									<Button className="bg-green-400 dark:text-white hover:bg-green-400 dark:bg-green-500 dark:hover:bg-green-600">
										Real Chat
									</Button>
								</div>
							</section>
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
}

export function ChatQuestion({ children }: { children: string }) {
	return (
		<div className="w-full flex justify-end my-2">
			<Card
				className={`h-max w-fit max-w-xl p-2  ${
					children.length > 200 ? "text-xl" : "text-2xl"
				}`}
			>
				{children}
			</Card>
		</div>
	);
}

export function ChatMessage({
	children,
	isLast = false,
	index,
}: {
	children: React.ReactNode | React.ReactNode[];
	isLast?: boolean;
	index: number;
}) {
	const messageRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isLast) return;
		messageRef.current?.parentElement?.scrollTo({
			top: messageRef.current?.offsetTop,
			behavior: "smooth",
		});
	}, [isLast]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: "tween",
				duration: 0.5,
			}}
			ref={messageRef}
		>
			{children}
		</motion.div>
	);
}
