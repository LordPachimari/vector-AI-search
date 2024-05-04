import { Image } from "lucide-react";

const ImagePlaceholder = ({ size }: { size?: number }) => {
	return (
		<div className=" rounded-soft flex h-full w-full items-center justify-center">
			<Image size={size ?? 25} className="text-blue-7" />
		</div>
	);
};

export default ImagePlaceholder;
