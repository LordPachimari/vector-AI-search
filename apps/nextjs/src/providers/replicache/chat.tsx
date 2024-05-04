"use client";

import { ChatMutators } from "@soulmate/api";
import { useEffect } from "react";
import { Replicache } from "replicache";
import { env } from "~/env";

import { useReplicache } from "~/zustand/replicache";

export default function ChatReplicacheProvider({
	userID,
	children,
}: Readonly<{
	userID: string | null | undefined;
	children: React.ReactNode;
}>) {
	const chatRep = useReplicache((state) => state.chatRep);
	const setChatRep = useReplicache((state) => state.setChatRep);

	useEffect(() => {
		if (chatRep) return;
		if (!userID) return window.location.reload();
		const r = new Replicache({
			name: "global",
			licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
			pullInterval: null,
			mutators: ChatMutators,
			indexes: {
				id: {
					jsonPointer: "/id",
					allowEmpty: true,
				},
			},
			//@ts-ignore
			puller: async (req) => {
				const now = performance.now();
				const result = await fetch(`${env.NEXT_PUBLIC_WORKER_URL}/pull/chat`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": userID,
					},
					body: JSON.stringify(req),
					credentials: "include",
				});
				const end = performance.now();
				console.log("pull time", end - now);

				return {
					response: result.status === 200 ? await result.json() : undefined,
					httpRequestInfo: {
						httpStatusCode: result.status,
						errorMessage: result.statusText,
					},
				};
			},
		});
		setChatRep(r);
	}, [chatRep, setChatRep, userID]);

	return <>{children}</>;
}
