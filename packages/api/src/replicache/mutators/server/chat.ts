import { Effect } from "effect";
// import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
// import { Redis } from "@upstash/redis";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import {
	CreateChatSchema,
	CreateMessageSchema,
	CreateSystemMessageSchema,
	type SystemMessage,
} from "@soulmate/validators";
import { z } from "zod";
import { Database, TableMutator } from "../../context";
import { zod } from "../zod";

const createChat = zod(CreateChatSchema, (input) =>
	Effect.gen(function* (_) {
		const { chat } = input;
		const tableMutator = yield* _(TableMutator);

		return yield* _(tableMutator.set(chat, "chats"));
	}),
);
const createMessage = zod(CreateMessageSchema, (input) =>
	Effect.gen(function* () {
		const { message } = input;
		const tableMutator = yield* TableMutator;

		return yield* Effect.all(
			[
				tableMutator.set(message, "messages"),
				tableMutator.update(message.chatID, {}, "chats"),
			],
			{ concurrency: 2 },
		);
	}),
);

const createSystemMessage = zod(CreateSystemMessageSchema, (input) =>
	Effect.gen(function* () {
		const { message, isProfileFinder, targetUserID } = input;
		const tableMutator = yield* TableMutator;
		const { serverURL, userID, GOOGLE_API_KEY, manager } = yield* Database;

		const modifiedMessage: SystemMessage = {
			...message,
			loading: false,
		};
		if (isProfileFinder) {
			const profileIDs = yield* Effect.tryPromise(() =>
				fetch(`${serverURL}/get-profiles`, {
					method: "POST",
					headers: {
						"Content-type": "text/plain",
						"x-user-id": userID,
					},
					body: message.question,
				}).then((data) => data.json() as Promise<(string | null)[]>),
			);
			console.log(">>>>>>", profileIDs);

			modifiedMessage.answer = profileIDs.filter((p) => p !== null) as string[];
		} else {
			const messages = Effect.tryPromise(() =>
				manager.query.systemMessages.findMany({
					where: (msgs, { eq }) => eq(msgs.chatID, message.chatID),
				}),
			).pipe(Effect.orDie);
			const userInfo = Effect.tryPromise(() =>
				manager.query.users.findFirst({
					where: (user, { eq }) => eq(user.id, targetUserID!),
				}),
			).pipe(Effect.orDie);
			const [msgs, user] = yield* Effect.all([messages, userInfo], {
				concurrency: 2,
			});
			yield* Effect.log(JSON.stringify(user));
			// const chatHistory:Content[] = msgs.flatMap((m) => [
			// 	{
			// 		parts: [{ text: m.question ?? "" }],
			// 		role: "user",
			// 	},

			// 	{ parts: [{ text: m.answer ?? "" }], role: "model" },
			// ]);
			const chatHistory: Content[] = msgs.flatMap((m) => [
				{
					role: "user",
					parts: [
						{
							text: m.question,
						},
					],
				},
				{
					role: "model",
					parts: [
						{
							text: JSON.stringify(m.answer ?? "") as string,
						},
					],
				},
			]);
			yield* Effect.log(JSON.stringify(chatHistory));
			if (user) {
				const answer = yield* Effect.tryPromise(() =>
					handleGoogleResponse(
						GOOGLE_API_KEY,
						message.question,
						JSON.stringify(user),
						chatHistory as Content[],
					),
				);
				modifiedMessage.answer = answer;
			}
		}
		return yield* Effect.all(
			[
				tableMutator.set(modifiedMessage, "systemMessages"),
				tableMutator.update(message.chatID, {}, "chats"),
			],
			{ concurrency: 2 },
		);
	}),
);
const clearChat = zod(z.object({ chatID: z.string() }), (input) =>
	Effect.gen(function* () {
		const { chatID } = input;
		const { manager } = yield* Database;
		const messageIDs = yield* Effect.tryPromise(() =>
			manager.query.systemMessages.findMany({
				columns: {
					id: true,
				},
				where: (msg, { eq }) => eq(msg.chatID, chatID),
			}),
		);

		const tableMutator = yield* TableMutator;
		messageIDs.length > 0 &&
			(yield* tableMutator.delete(
				messageIDs.map((m) => m.id),
				"messages",
			));
	}),
);

const handleGoogleResponse = async (
	googleKey: string,
	question: string,
	userData: string,
	history: Content[],
) => {
	const genAI = new GoogleGenerativeAI(googleKey);
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const defaultHistory: Content[] = [
		{
			role: "user",
			parts: [
				{
					text: `You are an agent who has a purpose of connecting students to each other. You are given personal information of a student'.\n\n Information:\n${userData} \nAnswer user question based on the information. The other student wants to get to know that person to become friends, or future partner, essentially a soulmate. Answer shortly, as human as possible. Keep mysterious, do not tell everything right away. Question: ${question}\nAnswer:`,
				},
			],
		},
		{
			role: "model",
			parts: [
				{
					text: "Ok, I am a agent who will help you to connect with other students. I will provide any necessary information related to the inquired student data, but also will keep it mysterious.",
				},
			],
		},
	];

	const chat = model.startChat({
		history: [...defaultHistory, ...history],
	});

	const output = await chat.sendMessageStream(question);
	const response = await output.response;

	return response.text();
};

export { clearChat, createChat, createMessage, createSystemMessage };
