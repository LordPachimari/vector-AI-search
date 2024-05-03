import { Image } from "lucide-react";

const ImagePlaceholder = ({ size }: { size?: number }) => {
	return (
		<div className="bg-grey-5 rounded-soft flex h-full w-full items-center justify-center">
			<Image size={size ?? 25} className="text-slate-9" />
		</div>
	);
};

export default ImagePlaceholder;
