export const runtime = "edge";

export default function HomePage() {
	// You can await this here if you don't want to show Suspense fallback below

	return (
		<main className="container h-screen py-16">
			<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
				Create uni soulmate
			</h1>
		</main>
	);
}
