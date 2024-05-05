import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateID } from "@soulmate/utils";
import { env } from "./env";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const userID = request.cookies.has("user_id");
	if (!userID) {
		const newID = generateID({ prefix: "user" });
		const result = await fetch(`${env.NEXT_PUBLIC_WORKER_URL}/create-user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: newID,
			}),
		});

		const result1 = await fetch(
			`${env.NEXT_PUBLIC_WORKER_URL}/create-soulmate-chat`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userID: newID,
				}),
			},
		);

		response.cookies.set("user_id", newID);
		response.cookies.set("chat_id", `soulmate_chat_${newID}`);
	}
	return response;
}
