import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/ui/dialog";
import { ImageSection } from "./components/image";

export default function Page() {
	return (
		<main className="w-full flex items-center justify-center">
			<div className="max-w-7xl pt-20">
				<section>
					<h3 className="text-6xl font-extrabold tracking-tight py-4">
						Build your <span className="text-blue-9">profile</span>
					</h3>
					<div className="w-full flex justify-center">
						<Dialog>
							<DialogTrigger>
								<Avatar className="w-[10rem] h-[10rem]">
									<AvatarImage
										src="https://github.com/shadcn.png"
										alt="avatar image"
									/>
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Upload profile image</DialogTitle>
								</DialogHeader>
								<ImageSection/>
							</DialogContent>
						</Dialog>
					</div>
				</section>
				{/* <section></section> */}
				<section>daw</section>
			</div>
		</main>
	);
}
