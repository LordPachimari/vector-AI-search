import Image from "next/image";

export const Logo = () => {
	return (
		<Image
			className="h-6 w-6 rounded-full"
			src="/Atlassian.webp"
			width={40}
			height={40}
			alt="logo"
		/>
	);
};
