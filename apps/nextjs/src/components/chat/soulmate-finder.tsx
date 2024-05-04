"use client";
import { generateID } from "@soulmate/utils";
import type { Chat as ChatType } from "@soulmate/validators";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReplicacheStore } from "~/replicache-store";
import { Button } from "~/ui/button";
import { Textarea } from "~/ui/textarea";
import { useReplicache } from "~/zustand/replicache";
import { ChatMessage, ChatProfileAnswer, ChatQuestion } from "./chat-message";
import { ScrollArea } from "~/ui/scrollarea";

export function SoulmateFinderChat({
	userID,
	setChatID,
	setAI,
}: {
	userID: string | null | undefined;
	setChatID: (id: string | null) => void;
	setAI: (id: string | null) => void;
}) {
	const [value, setValue] = useState("");
	const chatRep = useReplicache((state) => state.chatRep);
	const chat = ReplicacheStore.getByPK<ChatType>(
		chatRep,
		`soulmate_chat_${userID}`,
	);
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
						chatID: `soulmate_chat_${userID}`,
						question: text,
						version: 0,
						loading: true,
					},
					isProfileFinder: true,
				}));
			setValue("");
		},
		[userID, chatRep, chat],
	);
	const textArea = useRef<HTMLTextAreaElement>(null);

	return (
		<main className="w-full flex justify-center max-h-screen">
			<div className="w-full flex flex-col max-w-4xl">
				<ScrollArea className="w-full h-[calc(100vh-200px)] p-4">
					{messages.map((msg, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<ChatMessage index={i} key={i} isLast={i === messages.length - 1}>
							<ChatQuestion>{msg.question}</ChatQuestion>
							<ChatProfileAnswer
								loading={!!msg.loading}
								profileIDs={msg.answer ? (msg.answer as string[]) : []}
								setChatID={setChatID}
								userID={userID}
								setAI={setAI}
							/>
						</ChatMessage>
					))}
					<div ref={endOfMessagesRef} />
				</ScrollArea>
				<div className="flex w-full items-center mb-6 gap-2 justify-center">
					{messages.length > 0 && (
						<Button
							onClick={async () =>
								userID &&
								(await chatRep?.mutate.clearChat({
									chatID: `soulmate_chat_${userID}`,
								}))
							}
							variant={"ghost"}
							className="fixed bg-blue-3 text-blue-9 hover:bg-blue-4 hover:text-blue-9 bottom-36"
						>
							Clear
						</Button>
					)}
					<Textarea
						ref={textArea}
						value={value}
						placeholder="Find someone who likes..."
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
