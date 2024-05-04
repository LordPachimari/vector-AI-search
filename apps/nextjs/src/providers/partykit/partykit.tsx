"use client";

import type { SpaceID } from "@soulmate/validators";
import usePartySocket from "partysocket/react";
import { env } from "~/env";

import { useReplicache } from "~/zustand/replicache";

export default function PartykitProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { chatRep, globalRep } = useReplicache();

	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: env.NEXT_PUBLIC_PARTYKIT_HOST, // or localhost:1999 in dev
		room: "global",

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			console.log("connected");
		},
		onMessage(e) {
			const space = e.data as SpaceID;
			console.log("space", space);
			if (space === "chat") {
				return chatRep?.pull();
			}
			return globalRep?.pull();
		},
		onClose() {
			console.log("closed");
		},
		onError(e) {
			console.log("error");
		},
	});

	return <>{children}</>;
}
