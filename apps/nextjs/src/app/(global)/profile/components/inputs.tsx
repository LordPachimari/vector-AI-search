"use client";
import type { UpdateUser, User } from "@soulmate/validators";
import { useEffect, useState } from "react";
import { uni } from "~/constants";
import { Input } from "~/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/ui/select";
import TagInput from "~/ui/tag-input";
import { Textarea } from "~/ui/textarea";
import type { DebouncedFunc } from "~/utils/helpers";
export function Inputs({
	onInputChange,
	updateProfile,
	user,
}: {
	onInputChange: DebouncedFunc<(props: UpdateUser["updates"]) => Promise<void>>;
	updateProfile: (updates: UpdateUser["updates"]) => Promise<void>;
	user: User | undefined | null;
}) {
	const [hobbies, setHobbies] = useState<string[]>([]);
	const [skills, setSkills] = useState<string[]>([]);
	useEffect(() => {
		if (user?.hobbies) {
			setHobbies(user?.hobbies);
		}
		if (user?.skills) {
			setSkills(user?.skills);
		}
	}, [user?.hobbies, user?.skills]);
	return (
		<section className="w-full flex flex-col">
			<div>
				<label className="font-semibold">Full Name</label>
				<Input
					placeholder="Conor Mcgregor"
					defaultValue={user?.fullName ?? ""}
					onChange={async (e) => {
						await onInputChange({ fullName: e.currentTarget.value });
					}}
				/>
			</div>

			<div className="my-2">
				<label className="font-semibold">University</label>
				<Select
					onValueChange={async (value) =>
						await updateProfile({ uni: value as (typeof uni)[number] })
					}
					value={user?.uni ?? undefined}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select uni" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{uni.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="my-2">
				<label className="font-semibold">
					{"List you hobbies. (Press comma to separate)"}
				</label>
				<TagInput
					values={hobbies}
					onChange={async (values) => {
						console.log("hobbies", values);
						setHobbies(values as string[]);
						await updateProfile({ hobbies: values as string[] });
					}}
					className="w-full"
					placeholder="painting, music, sports, eat burgers"
				/>
			</div>
			<div className="my-2">
				<label className="font-semibold">
					{"List you skills. (Press comma to separate)"}
				</label>
				<TagInput
					values={skills}
					onChange={async (values) => {
						console.log("skills", values);
						setSkills(values as string[]);
						await updateProfile({ skills: values as string[] });
					}}
					className="w-full"
					placeholder="typescript, GO, AI, React, AWS"
				/>
			</div>

			<div className="my-2">
				<label className="font-semibold">
					{"About me. (course names, uni year)"}
				</label>
				<Textarea
					defaultValue={user?.about ?? undefined}
					onChange={async (e) => {
						await onInputChange({ about: e.currentTarget.value });
					}}
					placeholder="I am a senior Monash student. I'm currently studying computers science and I don't shower. Looking for hot girls and men."
				/>
			</div>
		</section>
	);
}
