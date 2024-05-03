"use client";

import usePartySocket from "partysocket/react";
import { env } from "~/env";

import { useReplicache } from "~/zustand/replicache";

export default function PartykitProvider({
	children,
	userID,
}: Readonly<{
	children: React.ReactNode;
	userID: string | undefined | null;
}>) {
	const { chatRep, globalRep, setChatRep, setGlobalRep } = useReplicache();

	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: env.NEXT_PUBLIC_PARTYKIT_HOST, // or localhost:1999 in dev
		room: "user",

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			console.log("connected");
		},
		onMessage() {
			if (globalRep) {
				globalRep.pull();
			}
		},
		onClose() {
			console.log("closed");
		},
		onError(e) {
			console.log("error");
		},
	});
	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: env.NEXT_PUBLIC_PARTYKIT_HOST, // or localhost:1999 in dev
		room: "chat",

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			console.log("connected");
		},
		onMessage(e) {
			const subspaces = JSON.parse(e.data) as string[];
			console.log("message", subspaces);
			if (chatRep) {
				chatRep.pull();
			}
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
