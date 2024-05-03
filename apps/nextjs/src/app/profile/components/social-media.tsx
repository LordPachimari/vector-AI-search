import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { Button } from "~/ui/button";

export function SocialMedia(){
    return (
        <section>
            <h3 className="text-sm font-semibold text-balance overflow-clip w-[25rem]">{"We will scan your tweet likes, follows and bookmarks. To find someone who share similar interests. "}</h3>
            <Button variant="outline" className="border-blue-9 my-2 hover:bg-blue-3 text-blue-9 hover:text-blue-10 flex gap-2"><TwitterLogoIcon/>Twitter</Button>
        </section>
    )
}