import { ShoppingBag } from "lucide-react";
import { MeteorsDemo } from "./meteors";

function Features() {
	const features = [
		{
			title: "Similarity search",
			description:
				"Find students with similar interests as you with our vector based search.",
			icon: <ShoppingBag />,
		},
		{
			title: "Real time chat",
			description: "Connect with students in real time with our chat feature.",
			icon: <ShoppingBag />,
		},
		{
			title: "Ask ai",
			description:
				"Ask AI questions if you want to know more about your picked soulmate.",
			icon: <ShoppingBag />,
		},
	];

	return (
		<section className="flex flex-col items-center px-6 sm:px-14 ">
			<div className="">
				<h2 className="text-center text-4xl font-bold lg:text-5xl lg:tracking-tight">
					Features
				</h2>
			</div>

			<ul className="mt-8 grid w-full gap-4 sm:grid-cols-2 md:w-10/12 md:grid-cols-3">
				{features.map((item, i) => (
					<MeteorsDemo
						key={item.title}
						title={item.title}
						description={item.description}
					/>
				))}
			</ul>
		</section>
	);
}

export { Features };
