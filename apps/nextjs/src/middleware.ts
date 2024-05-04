import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateID } from "@soulmate/utils";
import { env } from "./env";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const userID = request.cookies.has("user_id");
	const newID = generateID({ prefix: "user" });
	if (!userID) {
		const result = await fetch(`${env.NEXT_PUBLIC_WORKER_URL}/create-user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: newID,
			}),
		});
		console.log("are u ok?", result.ok);
		response.cookies.set("user_id", newID);
	}
	return response;
}
