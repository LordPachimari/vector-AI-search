"use client";
import { generateID } from "@soulmate/utils";
import type { Chat as ChatType } from "@soulmate/validators";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReplicacheStore } from "~/replicache-store";
import { Button } from "~/ui/button";
import { Textarea } from "~/ui/textarea";
import { useReplicache } from "~/zustand/replicache";
import { ChatAnswer, ChatMessage, ChatQuestion } from "./chat-message";
import { ScrollArea } from "~/ui/scrollarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import ImagePlaceholder from "../image-placeholder";

export function AIChat({
	userID,
	chatID,
}: {
	userID: string | null | undefined;
	chatID: string | null | undefined;
}) {
	const [value, setValue] = useState("");
	const chatRep = useReplicache((state) => state.chatRep);
	const chat = ReplicacheStore.getByPK<ChatType>(chatRep, chatID ?? "");
	const messages = chat?.systemMessages ?? [];
	const endOfMessagesRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "instant" });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		scrollToBottom();
	}, [messages]); // Dependency array includes messages, so it triggers on their update.

	const onSend = useCallback(
		async (text: string) => {
			const newID = generateID({ prefix: "message" });
			userID &&
				chat &&
				(await chatRep?.mutate.createSystemMessage({
					message: {
						id: newID,
						createdAt: new Date().toISOString(),
						chatID: chat.id,
						question: text,
						version: 0,
						loading: true,
					},
					isProfileFinder: false,
					targetUserID:
						chat.chatter1ID !== userID
							? chat.chatter1ID
							: chat.chatter2ID ?? "",
				}));
			setValue("");
		},
		[userID, chatRep, chat],
	);
	const textArea = useRef<HTMLTextAreaElement>(null);

	return (
		<main className="w-full flex justify-center max-h-screen">
			<div className="w-full flex flex-col max-w-4xl">
				<div className="bg-background flex h-[80px] items-center rounded-lg justify-center">
					<Avatar className="w-[4rem] h-[4rem]">
						<AvatarImage
							src={
								chat?.chatter1ID === userID
									? chat?.chatter2?.avatarURL ?? undefined
									: chat?.chatter1?.avatarURL ?? undefined
							}
							alt="avatar image"
						/>
						<AvatarFallback className="bg-blue-4 hover:bg-blue-5">
							<ImagePlaceholder />
						</AvatarFallback>
					</Avatar>
					{chat?.isAI && "(AI)"}
				</div>
				<ScrollArea className="w-full h-[calc(100vh-280px)] p-4">
					{messages.map((msg, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<ChatMessage index={i} key={i} isLast={i === messages.length - 1}>
							<ChatQuestion>{msg.question}</ChatQuestion>
							<ChatAnswer
								loading={!!msg.loading}
								text={msg.answer as string | undefined}
							/>
						</ChatMessage>
					))}
					<div ref={endOfMessagesRef} />
				</ScrollArea>
				{/* </div> */}
				<div className="flex w-full items-center mb-6 gap-2 justify-center">
					<Textarea
						disabled={messages.some((m) => m.loading === true)}
						ref={textArea}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={async (e) => {
							const isLoading = messages.some((m) => m.loading === true);
							if (e.key === "Enter" && !e.shiftKey && !isLoading) {
								e.preventDefault();
								await onSend(value);
							}
						}}
					/>

					<Button
						size="icon"
						onClick={async () => await onSend(value)}
						disabled={
							value.trim().length < 1 ||
							messages.some((m) => m.loading === true)
						}
					>
						<ArrowUp className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</main>
	);
}
