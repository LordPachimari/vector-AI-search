"use client";
import { Input } from "~/ui/input";
import { Textarea } from "~/ui/textarea";
import { useState } from "react";
import TagInput from "~/ui/tag-input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/ui/select";
import { uni } from "~/constants";
export function Inputs() {
	const [hobbies, setHobbies] = useState<string[]>([]);
	const [skills, setSkills] = useState<string[]>([]);
	return (
		<section className="w-full flex flex-col">
			<div>
				<label className="font-semibold">First name</label>
				<Input placeholder="Conor Mcgregor" />
			</div>

			<div className="my-2">
				<label className="font-semibold">University</label>
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select uni" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{uni.map((name) => (
								<SelectItem key={name} value="name">
									{name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="my-2">
				<label className="font-semibold">
					{"Write you hobby. (Press enter to separate)"}
				</label>
				<TagInput
					values={hobbies}
					onChange={async (values) => {
						console.log("hobbies", values);
						setHobbies(values as string[]);
					}}
					className="w-full"
					placeholder="painting, music, sports, eat burgers"
				/>
			</div>
			<div className="my-2">
				<label className="font-semibold">
					{"Write you skills. (Press comma to separate)"}
				</label>
				<TagInput
					values={skills}
					onChange={async (values) => {
						console.log("skills", values);
						setSkills(values as string[]);
					}}
					className="w-full"
					placeholder="typescript, GO, AI, React, AWS"
				/>
			</div>

			<div className="my-2">
				<label className="font-semibold">
					{"About me. (course names, uni year)"}
				</label>
				<Textarea placeholder="I am a senior Monash student. I'm currently studying computers science and I don't shower. Looking for hot girls and men." />
			</div>
		</section>
	);
}
