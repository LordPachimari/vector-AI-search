import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { CircleCheck } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getTwitterURL } from "~/actions/twitter-auth";
import { Button } from "~/ui/button";

export function SocialMedia({
	twitterAuth,
}: { twitterAuth?: boolean | undefined }) {
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (isPending) toast.info("Wait a moment...");
	}, [isPending]);
	return (
		<section>
			<h3 className="text-sm font-semibold text-balance overflow-clip w-full md:w-[25rem]">
				{
					"We will scan your tweet likes, follows and bookmarks. To find someone who share your interests. "
				}
			</h3>
			<div className="flex gap-2 items-center">
				<Button
					variant="outline"
					className="border-blue-9 my-2 hover:bg-blue-3 text-blue-9 hover:text-blue-10 flex gap-2"
					disabled={isPending || twitterAuth}
					onClick={async () => {
						startTransition(async () => {
							await getTwitterURL();
						});
					}}
				>
					<TwitterLogoIcon />
					Twitter
				</Button>
				{twitterAuth && <CircleCheck className="text-blue-9" />}
			</div>
		</section>
	);
}
