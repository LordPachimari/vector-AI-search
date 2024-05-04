"use client";
import type { UpdateUser, User } from "@soulmate/validators";
import debounce from "lodash.debounce";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useTransition } from "react";
import { toast } from "sonner";
import ImagePlaceholder from "~/components/image-placeholder";
import { ReplicacheStore } from "~/replicache-store";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Button } from "~/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/ui/dialog";
import { useReplicache } from "~/zustand/replicache";
import { ImageSection } from "./image";
import { Inputs } from "./inputs";
import { SocialMedia } from "./social-media";
import { env } from "~/env";

export default function ProfilePage({ userID }: { userID: string }) {
	const params = useSearchParams();
	const isTwitter = params.has("twitter");
	const globalRep = useReplicache((state) => state.globalRep);
	const user = ReplicacheStore.getByID<User>(globalRep, userID);
	const updateProfile = useCallback(
		async (updates: UpdateUser["updates"]) => {
			if (globalRep) {
				await globalRep.mutate.updateUser({
					id: userID,
					updates,
				});
			}
		},
		[globalRep, userID],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onInputChange = useCallback(
		debounce(async (updates: UpdateUser["updates"]) => {
			await updateProfile(updates);
		}, 500),
		[globalRep],
	);

	const [isPending, startTransition] = useTransition();
	useEffect(() => {
		if (isTwitter && user && !user.twitterAuth) {
			updateProfile({ twitterAuth: true }).then(() =>
				toast.success("Twitter accound data stored!"),
			);
		}
	}, [isTwitter, updateProfile, user]);

	return (
		<main className="w-full flex items-center justify-center px-4">
			<div className="max-w-2xl pt-20 w-full">
				<section className="w-full">
					<h3 className="text-6xl font-extrabold tracking-tight py-4 text-center">
						Your <span className="text-blue-9">profile</span>
					</h3>
					<div className="w-full flex justify-center">
						<Dialog>
							<DialogTrigger>
								<Avatar className="w-[10rem] h-[10rem]">
									<AvatarImage
										src={user?.avatarURL ?? undefined}
										alt="avatar image"
									/>
									<AvatarFallback className="bg-blue-4 hover:bg-blue-5">
										<ImagePlaceholder />
									</AvatarFallback>
								</Avatar>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Upload profile image</DialogTitle>
								</DialogHeader>
								<ImageSection updateProfile={updateProfile} />
							</DialogContent>
						</Dialog>
					</div>
				</section>
				<Inputs
					onInputChange={onInputChange}
					updateProfile={updateProfile}
					user={user}
				/>
				{/* <section></section> */}
				<SocialMedia />
				<section className="w-full flex justify-center">
					<Button
						disabled={isPending}
						onClick={async () => {
							startTransition(async () => {
								user &&
									(await fetch(`${env.NEXT_PUBLIC_WORKER_URL}/store-profile`, {
										method: "POST",
										body: JSON.stringify({
											user,
										}),
									}));
							});
						}}
					>
						Find soulmate, now!
					</Button>
				</section>
			</div>
		</main>
	);
}
