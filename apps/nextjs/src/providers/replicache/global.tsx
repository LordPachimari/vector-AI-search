"use client";

import { GlobalMutators } from "@soulmate/api";
import { useEffect } from "react";
import { Replicache } from "replicache";
import { env } from "~/env";

import { useReplicache } from "~/zustand/replicache";

export default function GlobalReplicacheProvider({
	userID,
	children,
}: Readonly<{
	userID: string | null | undefined;
	children: React.ReactNode;
}>) {
	const globalRep = useReplicache((state) => state.globalRep);
	const setGlobalRep = useReplicache((state) => state.setGlobalRep);

	useEffect(() => {
		if (globalRep) return;
		if (!userID) return window.location.reload();
		const r = new Replicache({
			name: "global",
			licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
			pullInterval: null,
			mutators: GlobalMutators,
			indexes: {
				id: {
					jsonPointer: "/id",
					allowEmpty: true,
				},
			},
			//@ts-ignore
			puller: async (req) => {
				const now = performance.now();
				const result = await fetch(
					`${env.NEXT_PUBLIC_WORKER_URL}/pull/global`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"x-user-id": userID,
						},
						body: JSON.stringify(req),
					},
				);
				const end = performance.now();

				return {
					response: result.status === 200 ? await result.json() : undefined,
					httpRequestInfo: {
						httpStatusCode: result.status,
						errorMessage: result.statusText,
					},
				};
			},
			pusher: async (req) => {
				const now = performance.now();
				const result = await fetch(
					`${env.NEXT_PUBLIC_WORKER_URL}/push/global`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"x-user-id": userID,
						},
						body: JSON.stringify(req),
					},
				);
				const end = performance.now();

				return {
					httpRequestInfo: {
						httpStatusCode: result.status,
						errorMessage: result.statusText,
					},
				};
			},
		});
		setGlobalRep(r);
	}, [globalRep, setGlobalRep, userID]);

	return <>{children}</>;
}
