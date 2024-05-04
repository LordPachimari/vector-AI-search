import { Features } from "~/components/landing/features";
import { Hero } from "~/components/landing/hero";
export const runtime = "edge";

export default function HomePage() {
	// You can await this here if you don't want to show Suspense fallback below

	return (
		<main>
			<Hero />
			<Features />
			<div className="h-40" />
		</main>
	);
}
