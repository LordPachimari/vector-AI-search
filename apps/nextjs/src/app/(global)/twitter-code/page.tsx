import { redirect } from "next/navigation";

import { env } from "~/env";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const code = searchParams.code;
	if (typeof code === "string") {
		const res = await fetch(
			`${env.NEXT_PUBLIC_SERVER_URL}/store-twitter-data`,
			{
				method: "POST",
				headers: {
					"x-twitter-code": code,
				},
			},
		);
		if (!res.ok) {
			return redirect("/error");
		}

		return redirect("/profile?twitter=1");
	}
	return redirect("/error");
}
