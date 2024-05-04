"use client";
import React, { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/ui/dialog";
import debounce from "lodash.debounce";
import { Button } from "~/ui/button";
import { ImageSection } from "./image";
import { Inputs } from "./inputs";
import { SocialMedia } from "./social-media";
import { useReplicache } from "~/zustand/replicache";
import type { UpdateUser, User } from "@soulmate/validators";
import { ReplicacheStore } from "~/replicache-store";
import ImagePlaceholder from "~/components/image-placeholder";

export default function ProfilePage({ userID }: { userID: string }) {
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
					<Button>Found soulmate, now!</Button>
				</section>
			</div>
		</main>
	);
}
