import { CircleUser, Menu, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "~/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import { Input } from "~/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/ui/sheet";
import { Logo } from "./logo";
import { ThemeToggle } from "~/providers/themes";

export const Header = () => {
	return (
		<header className="fixed top-0 z-40 flex justify-center w-full h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<div className="flex max-w-7xl w-full">
				<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
					<Link
						href="/"
						className="flex items-center gap-2 text-lg font-semibold"
					>
						<Logo />
						<span className="sr-only">Uni Soulmate</span>
						<span className="flex text-sm w-[8rem]">
							Uni <span className="text-blue-9">Soulmate</span>
						</span>
					</Link>
					<Link
						href="/soulmate"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						Main
					</Link>
				</nav>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="shrink-0 md:hidden"
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<nav className="grid gap-6 text-lg font-medium">
							<Link
								href="/"
								className="flex items-center gap-2 text-lg font-semibold"
							>
								<Logo />
								<span className="sr-only">Uni Soulmate</span>
							</Link>
							<Link
								href="/soulmate"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								Soulmate
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
				<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
					<div className="ml-auto flex-1 sm:flex-initial">
						{/* <ThemeToggle /> */}
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="rounded-full bg-blue-4 hover:bg-blue-5"
							>
								<CircleUser className="h-5 w-5 text-blue-9" />
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<Link href="/profile">
								<DropdownMenuLabel>My Profile</DropdownMenuLabel>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};
