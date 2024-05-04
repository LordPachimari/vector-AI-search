import Image from "next/image";
import Link from "next/link";

function Hero() {
	return (
		<section className="flex h-screen w-screen flex-col items-center justify-center px-4 pt-10 sm:px-14 md:pt-8 lg:flex-row lg:pt-16">
			<div className="py-6 lg:order-1">
				<Image
					src="/hero.png"
					alt="Hero Image"
					loading="eager"
					width={500}
					height={500}
				/>
			</div>
			<div>
				<h1 className="text-balance text-center text-5xl font-bold lg:text-left lg:text-6xl lg:tracking-tight xl:text-7xl">
					Welcome to Uni
					<span className="text-balance bg-blue-9 from-brand-5 to-brand-7 bg-clip-text text-5xl font-bold text-transparent lg:text-6xl lg:tracking-tight xl:text-7xl">
						Soulmate
					</span>
				</h1>
				<p className="my-8 max-w-xl text-center text-lg  text-slate-600 lg:text-left">
					UniSoulmate is a platform that connects students around the world.
					With the power of AI, we can help you find your best study mate, or
					what we call your 'uni soulmate'—someone who shares similar interests,
					views, career goals, and hobbies, and even complements your
					differences! We help students find support and companionship in both
					their academic and personal lives.
				</p>
				<div className="mt-6 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
					<Link
						className="max-w-[400px] bg-blue-9 p-4 rounded-lg text-white font-bold"
						href="/soulmate"
					>
						Enter soulmate
					</Link>
				</div>
			</div>
		</section>
	);
}

export { Hero };
