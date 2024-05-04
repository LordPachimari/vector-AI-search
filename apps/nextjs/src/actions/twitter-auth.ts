"use server";
import { redirect } from "next/navigation";

import { env } from "~/env";

export const getTwitterURL = async (): Promise<string | undefined> => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/twitter-auth-url`, {
		method: "POST",
	});
	if (!res.ok) {
		return undefined;
	}

	const url = (await res.text()) as string;

	redirect(url);
};
