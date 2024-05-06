import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "~/app/globals.css";

import { env } from "~/env";
import { cn } from "~/utils/cn";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/ui/toaster";
import { Header } from "~/components/header";

export const metadata: Metadata = {
	metadataBase: new URL(
		env.VERCEL_ENV === "production"
			? "https://uni-soulmate.vercel.app"
			: "http://localhost:3000",
	),
	title: "Uni soulmate",
	description:
		"Find someone who shares your interests, hobbies, and values. Someone who can understand you. Someone who can be your best study mate",
	openGraph: {
		title: "Uni soulmate",
		description:
			"Find someone who shares your interests, hobbies, and values. Someone who can understand you. Someone who can be your best study mate",
		url: "https://create-t3-turbo.vercel.app",
		siteName: "Uni soulmate",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-blue-2 font-sans text-foreground antialiased",
					GeistSans.variable,
					GeistMono.variable,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<Header />
					{props.children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
